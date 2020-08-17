import { ethers } from 'ethers'
import {
  AMPL_TOKEN_ADDR,
  AMPL_WETH_UNI_TOKEN_ADDR,
  ERC20_ABI,
  UNISWAP_V2_PAIR_ABI,
  WETH_TOKEN_ADDR,
  YAM_TOKEN_ABI,
  YAM_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
} from '../../../constants'
import { priceLookupService } from '../../../price-lookup-service'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const stakingTokenAddr = AMPL_WETH_UNI_TOKEN_ADDR
  const stakingTokenTicker = 'UNIV2'
  const rewardPoolAddr = '0x9EbB67687FEE2d265D7b824714DF13622D90E663'
  const rewardTokenAddr = YAM_TOKEN_ADDR
  const balancerPoolTokenAddr = '0xc7062D899dd24b10BfeD5AdaAb21231a1e7708fE'
  const rewardTokenTicker = 'YAM'

  const Y_STAKING_POOL = new ethers.Contract(
    rewardPoolAddr,
    Y_STAKING_POOL_ABI as any,
    App.provider
  )
  const AMPL_TOKEN = new ethers.Contract(
    AMPL_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const AMPL_WETH_UNI_TOKEN = new ethers.Contract(
    AMPL_WETH_UNI_TOKEN_ADDR,
    UNISWAP_V2_PAIR_ABI,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(stakingTokenAddr, ERC20_ABI, App.provider)

  const YAM_TOKEN = new ethers.Contract(
    YAM_TOKEN_ADDR,
    YAM_TOKEN_ABI,
    App.provider
  )
  const WETH_TOKEN = new ethers.Contract(
    WETH_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const yamScale = (await YAM_TOKEN.yamsScalingFactor()) / 1e18

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI =
    (yamScale * (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS))) / 1e18
  const totalStakedYAmount = (await Y_TOKEN.balanceOf(rewardPoolAddr)) / 1e18

  const weekly_reward =
    (await get_synth_weekly_rewards(Y_STAKING_POOL)) * yamScale

  const rewardPerToken = weekly_reward / totalStakedYAmount

  const ethAmount =
    (await WETH_TOKEN.balanceOf(AMPL_WETH_UNI_TOKEN_ADDR)) / 1e18
  const amplAmount =
    (await AMPL_TOKEN.balanceOf(AMPL_WETH_UNI_TOKEN_ADDR)) / 1e9
  const totalUNIV2Amount = (await AMPL_WETH_UNI_TOKEN.totalSupply()) / 1e18

  const prices = await lookUpPrices(['ethereum', 'ampleforth', 'yam'])
  const {
    ethereum: ethPrice,
    ampleforth: ampPrice,
    yam: yamPrice,
  } = await priceLookupService.getPrices(['ethereum', 'ampleforth', 'yam'])
  const stakingTokenPrice =
    (ethPrice * ethAmount + ampPrice * amplAmount) / totalUNIV2Amount

  const rewardTokenPrice = yamPrice

  const YFIWeeklyROI =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: 'yam.finance',
    name: 'Yam AMPL',
    poolRewards: ['YAM'],
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: 'ETH', value: toDollar(prices.ethereum.usd) },
      { label: 'AMPL', value: toDollar(prices.ampleforth.usd) },
      { label: 'UNIV2', value: toDollar(stakingTokenPrice) },
      { label: 'YAM', value: toDollar(rewardTokenPrice) },
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
        title: 'Staking',
        link: 'https://yam.finance/',
      },
      {
        title: 'Ampleforth Pool',
        link:
          'https://app.uniswap.org/#/add/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xD46bA6D942050d489DBd938a2C909A5d5039A161',
      },
    ],
  }
}
