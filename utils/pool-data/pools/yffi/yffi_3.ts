import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFFI_DAI_BPT_TOKEN_ADDR,
  YFFI_POOL_3_ADDR,
  YFFI_REWARD_CONTRACT_ABI,
  YFFI_TOKEN_ADDR,
  YFFI_YCRV_BPT_TOKEN_ADDR,
  YCRV_TOKEN_ADDR,
} from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const YFFI_POOL_3 = new ethers.Contract(
    YFFI_POOL_3_ADDR,
    YFFI_REWARD_CONTRACT_ABI,
    App.provider
  )
  const YFFI_YCRV_BALANCER_POOL = new ethers.Contract(
    YFFI_YCRV_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFI_YCRV_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFFI_YCRV_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const YFFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFFI_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )

  const stakedBPTAmount = (await YFFI_POOL_3.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI_raw = await YFFI_POOL_3.earned(App.YOUR_ADDRESS)

  const earnedYFFI = earnedYFFI_raw / 1e18
  const totalBPTAmount = (await YFFI_YCRV_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFI_YCRV_BPT_TOKEN_CONTRACT.balanceOf(YFFI_POOL_3_ADDR)) / 1e18
  const totalYFFIAmount =
    (await YFFI_YCRV_BALANCER_POOL.getBalance(YFFI_TOKEN_ADDR)) / 1e18
  const totalYAmount =
    (await YFFI_YCRV_BALANCER_POOL.getBalance(YCRV_TOKEN_ADDR)) / 1e18

  // const yourUnstakedBPTAmount = await YFI_YCRV_BPT_TOKEN_CONTRACT.balanceOf(App.YOUR_ADDRESS) / 1e18;

  const YFFIPerBPT = totalYFFIAmount / totalBPTAmount
  const YPerBPT = totalYAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(YFFI_POOL_3)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  const prices = await lookUpPrices(['dai'])
  const DAIPrice = prices.dai.usd

  const YFFIPrice =
    ((await YFFI_DAI_BALANCER_POOL.getSpotPrice(
      DAI_TOKEN_ADDR,
      YFFI_TOKEN_ADDR
    )) /
      1e18) *
    DAIPrice

  const BPTPrice = YFFIPerBPT * YFFIPrice + YPerBPT * YVirtualPrice

  const YFFIWeeklyROI = (rewardPerToken * YFFIPrice * 100) / BPTPrice

  return {
    provider: 'yffi.finance',
    name: 'Balancer YFFI-yCRV',
    poolRewards: ['YFFI', 'CRV', 'BAL'],
    apr: toFixed(YFFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YFFI', value: toDollar(YFFIPrice) },
      { label: 'yCRV', value: toDollar(YVirtualPrice) },
      {
        label: 'BPT',
        value: toDollar(YFFIPerBPT * YFFIPrice + YPerBPT * YVirtualPrice),
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
            YPerBPT * stakedBPTAmount * YVirtualPrice
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
        title: 'Curve Pool',
        link: 'https://www.curve.fi/iearn/deposit',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0xc855F1572c8128ADd6F0503084Ba23930B7461f8',
      },
      {
        title: 'Staking',
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
