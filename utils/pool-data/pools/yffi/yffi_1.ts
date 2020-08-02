import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFFI_DAI_BPT_TOKEN_ADDR,
  YFFI_POOL_1_ADDR,
  YFFI_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
  Y_TOKEN_ADDR,
} from '../../../constants'
import {
  getPeriodFinishForReward,
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const Y_STAKING_POOL = new ethers.Contract(
    YFFI_POOL_1_ADDR,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(Y_TOKEN_ADDR, ERC20_ABI, App.provider)
  const YFFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFFI_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI = (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalSupplyY = (await Y_TOKEN.totalSupply()) / 1e18
  const totalStakedYAmount = (await Y_TOKEN.balanceOf(YFFI_POOL_1_ADDR)) / 1e18

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(Y_STAKING_POOL)
  const nextHalving = await getPeriodFinishForReward(Y_STAKING_POOL)

  // const weekly_reward = 0;

  const rewardPerToken = weekly_reward / totalStakedYAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  // const prices = await lookUpPrices(["yearn-finance"]);
  // const YFIPrice = prices["yearn-finance"].usd;
  const prices = await lookUpPrices(['dai'])
  const DAIPrice = prices['dai'].usd
  const YFFIPrice =
    ((await YFFI_DAI_BALANCER_POOL.getSpotPrice(
      DAI_TOKEN_ADDR,
      YFFI_TOKEN_ADDR
    )) /
      1e18) *
    DAIPrice

  const YFFIWeeklyEstimate = rewardPerToken * stakedYAmount

  const YFIWeeklyROI = (rewardPerToken * YFFIPrice * 100) / YVirtualPrice

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YFFI', value: toDollar(YFFIPrice) },
      { label: 'yCRV', value: toDollar(YVirtualPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedYAmount * YVirtualPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedYAmount * YVirtualPrice),
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
        value: `${toFixed(YFIWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(YFIWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(YFIWeeklyROI, 4)}%`,
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
