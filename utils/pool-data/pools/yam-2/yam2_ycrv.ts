import { ethers } from 'ethers'
import {
  ERC20_ABI,
  YAM_TOKEN_ABI,
  YCRV_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
} from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const stakingTokenAddr = YCRV_TOKEN_ADDR
  const YAM_YCRV_UNI_TOKEN_ADDR = '0xC329BC05CC9fb5f4e8dA13Bf6A849D33dD2A167b'
  const stakingTokenTicker = 'yCRV'
  const rewardPoolAddr = '0xE29b7D23e47c16B8EedF50a17A03649F5Db35433'
  const rewardTokenAddr = '0x49411930AC0c14713e36Db62700FBE31017aCc9A'
  const rewardTokenTicker = 'YAM2'

  const Y_STAKING_POOL = new ethers.Contract(
    rewardPoolAddr,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const STAKING_TOKEN = new ethers.Contract(
    stakingTokenAddr,
    ERC20_ABI,
    App.provider
  )

  const REWARD_TOKEN = new ethers.Contract(
    rewardTokenAddr,
    YAM_TOKEN_ABI,
    App.provider
  )

  const yamScale = (await REWARD_TOKEN.yamsScalingFactor()) / 1e18

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI =
    (yamScale * (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS))) / 1e18
  const totalStakedYAmount =
    (await STAKING_TOKEN.balanceOf(rewardPoolAddr)) / 1e18

  const weekly_reward =
    ((await get_synth_weekly_rewards(Y_STAKING_POOL)) *
      (await REWARD_TOKEN.yamsScalingFactor())) /
    1e18

  const rewardPerToken = weekly_reward / totalStakedYAmount

  const prices = await lookUpPrices(['curve-fi-ydai-yusdc-yusdt-ytusd'])
  const stakingTokenPrice = prices['curve-fi-ydai-yusdc-yusdt-ytusd'].usd

  const rewardTokenPrice =
    (stakingTokenPrice *
      ((await STAKING_TOKEN.balanceOf(YAM_YCRV_UNI_TOKEN_ADDR)) / 1e18)) /
    ((await REWARD_TOKEN.balanceOf(YAM_YCRV_UNI_TOKEN_ADDR)) / 1e18)

  const weeklyRoi =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: 'YAM Classic',
    name: 'YAM2 yCRV',
    poolRewards: [rewardTokenTicker],
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
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: stakingTokenTicker, value: toDollar(stakingTokenPrice) },
      { label: rewardTokenTicker, value: toDollar(rewardTokenPrice) },
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
        label: `${toFixed(earnedYFFI, 4)} ${rewardTokenTicker}`,
        value: toDollar(earnedYFFI * rewardTokenPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(weeklyRoi / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(weeklyRoi / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(weeklyRoi, 4)}%`,
      },
    ],
  }
}
