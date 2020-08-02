import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFFI_DAI_BPT_TOKEN_ADDR,
  YFFI_POOL_2_ADDR,
  YFFI_TOKEN_ADDR,
  YFFI_YCRV_BPT_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
  Y_TOKEN_ADDR,
} from '../../../constants'
import {
  forHumans,
  getPeriodFinishForReward,
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const YFFI_POOL_2 = new ethers.Contract(
    YFFI_POOL_2_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFFI_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFFI_DAI_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFFI_DAI_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const YFFI_YCRV_BALANCER_POOL = new ethers.Contract(
    YFFI_YCRV_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )

  const stakedBPTAmount = (await YFFI_POOL_2.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI = (await YFFI_POOL_2.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFFI_DAI_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFFI_DAI_BPT_TOKEN_CONTRACT.balanceOf(YFFI_POOL_2_ADDR)) / 1e18
  const totalYFFIAmount =
    (await YFFI_DAI_BALANCER_POOL.getBalance(YFFI_TOKEN_ADDR)) / 1e18
  const totalDAIAmount =
    (await YFFI_DAI_BALANCER_POOL.getBalance(DAI_TOKEN_ADDR)) / 1e18

  const YFFIPerBPT = totalYFFIAmount / totalBPTAmount
  const DAIPerBPT = totalDAIAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(YFFI_POOL_2)
  const nextHalving = await getPeriodFinishForReward(YFFI_POOL_2)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  const prices = await lookUpPrices(['dai'])
  const DAIPrice = prices['dai'].usd
  const YFFIPrice =
    ((await YFFI_DAI_BALANCER_POOL.getSpotPrice(
      DAI_TOKEN_ADDR,
      YFFI_TOKEN_ADDR
    )) /
      1e18) *
    DAIPrice
  const YFFIPrice2 =
    ((await YFFI_YCRV_BALANCER_POOL.getSpotPrice(
      Y_TOKEN_ADDR,
      YFFI_TOKEN_ADDR
    )) /
      1e18) *
    YVirtualPrice

  const BPTPrice = YFFIPerBPT * YFFIPrice + DAIPerBPT * DAIPrice

  const YFFIWeeklyEstimate = rewardPerToken * stakedBPTAmount

  const YFFIWeeklyROI = (rewardPerToken * YFFIPrice * 100) / BPTPrice

  const timeTilHalving = nextHalving - Date.now() / 1000

  return {
    apr: toFixed(YFFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YFFI', value: toDollar(YFFIPrice) },
      { label: 'DAI', value: toDollar(DAIPrice) },
      {
        label: 'BPT',
        value: toDollar(YFFIPerBPT * YFFIPrice + DAIPerBPT * DAIPrice),
      },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          YFFIPerBPT * stakedBPTAmount * YFFIPrice +
            DAIPerBPT * stakedBPTAmount * DAIPrice
        ),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedYFFI, 4)} YFFI`,
        value: toDollar(earnedYFFI * YFFIPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(YFFIWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(YFFIWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(YFFIWeeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Instructions',
        link: 'https://boxmining.com/yffi-yield-farming/',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0xFe793bC3D1Ef8d38934896980254e81d0c5F6239',
      },
      {
        title: 'Staking Pool',
        link: 'https://www.yffi.finance/#/stake',
      },
      {
        title: 'Token',
        link:
          'https://etherscan.io/address/0xCee1d3c3A02267e37E6B373060F79d5d7b9e1669',
      },
    ],
  }
}
