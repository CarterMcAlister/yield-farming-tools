import { ethers } from 'ethers'
import {
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  ERC20_ABI,
  YAM_TOKEN_ABI,
  YAM_TOKEN_ADDR,
  YAM_YCRV_UNI_TOKEN_ADDR,
  YFFI_REWARD_CONTRACT_ABI,
  Y_TOKEN_ADDR,
} from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const stakingTokenAddr = YAM_YCRV_UNI_TOKEN_ADDR
  const stakingTokenTicker = 'UNIV2'
  const rewardPoolAddr = '0xADDBCd6A68BFeb6E312e82B30cE1EB4a54497F4c'
  const rewardTokenAddr = YAM_TOKEN_ADDR
  const balancerPoolTokenAddr = '0xc7062D899dd24b10BfeD5AdaAb21231a1e7708fE'
  const rewardTokenTicker = 'YAM'

  const REWARD_POOL = new ethers.Contract(
    rewardPoolAddr,
    YFFI_REWARD_CONTRACT_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI,
    App.provider
  )
  const STAKING_TOKEN = new ethers.Contract(
    stakingTokenAddr,
    ERC20_ABI,
    App.provider
  )

  const Y_TOKEN = new ethers.Contract(Y_TOKEN_ADDR, ERC20_ABI, App.provider)

  const YAM_TOKEN = new ethers.Contract(
    YAM_TOKEN_ADDR,
    YAM_TOKEN_ABI,
    App.provider
  )

  const yamScale = (await YAM_TOKEN.yamsScalingFactor()) / 1e18

  const totalYCRVInUniswapPair =
    (await Y_TOKEN.balanceOf(YAM_YCRV_UNI_TOKEN_ADDR)) / 1e18
  const totalYAMInUniswapPair =
    (await YAM_TOKEN.balanceOf(YAM_YCRV_UNI_TOKEN_ADDR)) / 1e18

  const stakedYAmount = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI =
    (yamScale * (await REWARD_POOL.earned(App.YOUR_ADDRESS))) / 1e18
  const totalSupplyOfStakingToken = (await STAKING_TOKEN.totalSupply()) / 1e18
  const totalStakedYAmount =
    (await STAKING_TOKEN.balanceOf(rewardPoolAddr)) / 1e18

  // Find out reward rate
  const weekly_reward =
    ((await get_synth_weekly_rewards(REWARD_POOL)) *
      (await YAM_TOKEN.yamsScalingFactor())) /
    1e18

  const rewardPerToken = weekly_reward / totalStakedYAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  const prices = await lookUpPrices(['yam'])
  const stakingTokenPrice =
    (totalYAMInUniswapPair * prices['yam'].usd +
      totalYCRVInUniswapPair * YVirtualPrice) /
    totalSupplyOfStakingToken

  const rewardTokenPrice = prices['yam'].usd
  const YFIWeeklyROI =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: 'yam.finance',
    name: 'YAM/yCRV',
    poolRewards: ['YAM'],
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YAM', value: toDollar(rewardTokenPrice) },
      { label: stakingTokenTicker, value: toDollar(stakingTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedYAmount * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedYAmount * stakingTokenPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedYFFI, 4)} YAM`,
        value: toDollar(earnedYFFI * rewardTokenPrice),
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
        title: 'Info',
        link: 'https://medium.com/@yamfinance/yam-finance-d0ad577250c7',
      },
      {
        title: 'Pool',
        link:
          'https://uniswap.info/pair/0x2c7a51a357d5739c5c74bf3c96816849d2c9f726',
      },
      {
        title: 'Staking',
        link: 'https://yam.finance/',
      },
    ],
  }
}
