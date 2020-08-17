import { ethers } from 'ethers'
import {
  ERC20_ABI,
  SNX_TOKEN_ADDRESS,
  YAM_TOKEN_ABI,
  YAM_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
} from '../../../constants'
import { priceLookupService } from '../../../price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const stakingToken = SNX_TOKEN_ADDRESS
  const stakingTokenTicker = 'SNX'
  const rewardPoolAddr = '0x6c3FC1FFDb14D92394f40eeC91D9Ce8B807f132D'
  const rewardTokenAddr = YAM_TOKEN_ADDR
  const balancerPoolTokenAddr = '0xc7062D899dd24b10BfeD5AdaAb21231a1e7708fE'
  const rewardTokenTicker = 'YAM'

  const Y_STAKING_POOL = new ethers.Contract(
    rewardPoolAddr,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(stakingToken, ERC20_ABI, App.provider)

  const YAM_TOKEN = new ethers.Contract(
    YAM_TOKEN_ADDR,
    YAM_TOKEN_ABI,
    App.provider
  )

  const yamScale = (await YAM_TOKEN.yamsScalingFactor()) / 1e18

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI =
    (yamScale * (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS))) / 1e18
  const totalStakedYAmount = (await Y_TOKEN.balanceOf(rewardPoolAddr)) / 1e18

  const weekly_reward =
    ((await get_synth_weekly_rewards(Y_STAKING_POOL)) *
      (await YAM_TOKEN.yamsScalingFactor())) /
    1e18

  const rewardPerToken = weekly_reward / totalStakedYAmount

  const {
    havven: stakingTokenPrice,
    yam: rewardTokenPrice,
  } = await priceLookupService.getPrices(['havven', 'yam'])

  const YFIWeeklyROI =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: 'yam.finance',
    name: 'Yam SNX',
    poolRewards: ['YAM'],
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: stakingTokenTicker, value: toDollar(stakingTokenPrice) },
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
    ],
  }
}
