import { ethers } from 'ethers'
import { priceLookupService } from '../../services/price-lookup-service'
import { PoolData, TokenData } from '../../types'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../utils'
import { YCRV_TOKEN as yCrvToken } from '../../data/token-data'

export async function getSnxBasedStakingData(
  App,
  stakingToken: TokenData,
  rewardToken: TokenData,
  stakingPool: TokenData,
  poolData: PoolData,
  pricePoolAddress?: string
) {
  const STAKING_POOL = new ethers.Contract(
    stakingPool.address,
    stakingPool.ABI,
    App.provider
  )
  const STAKING_TOKEN = new ethers.Contract(
    stakingToken.address,
    stakingToken.ABI,
    App.provider
  )

  const REWARD_TOKEN = new ethers.Contract(
    rewardToken.address,
    rewardToken.ABI,
    App.provider
  )

  const YCRV_TOKEN = new ethers.Contract(
    yCrvToken.address,
    yCrvToken.ABI,
    App.provider
  )

  let scalingFactor

  try {
    scalingFactor = await REWARD_TOKEN.yamsScalingFactor()
  } catch (e) {}

  const yourStakedAmount =
    (await STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalStakedAmount =
    (await STAKING_TOKEN.balanceOf(stakingPool.address)) / 1e18

  let weekly_reward
  let yourEarnedRewards
  if (scalingFactor) {
    weekly_reward =
      ((await get_synth_weekly_rewards(STAKING_POOL)) * scalingFactor) / 1e18
    yourEarnedRewards =
      ((scalingFactor / 1e18) * (await STAKING_POOL.earned(App.YOUR_ADDRESS))) /
      1e18
  } else {
    weekly_reward = await get_synth_weekly_rewards(STAKING_POOL)
    yourEarnedRewards = (await STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  }

  const rewardPerToken = weekly_reward / totalStakedAmount
  let stakingTokenPrice
  let rewardTokenPrice
  if (!rewardToken.tokenId) {
    // Can't get price from gecko
    const prices = await priceLookupService.getPrices([
      stakingToken.tokenId,
      yCrvToken.tokenId,
    ])
    stakingTokenPrice = prices[stakingToken.tokenId]
    rewardTokenPrice =
      (prices[yCrvToken.tokenId] *
        ((await YCRV_TOKEN.balanceOf(pricePoolAddress)) / 1e18)) /
      ((await REWARD_TOKEN.balanceOf(pricePoolAddress)) / 1e18)
  } else {
    const prices = await priceLookupService.getPrices([
      stakingToken.tokenId,
      rewardToken.tokenId,
    ])
    stakingTokenPrice = prices[stakingToken.tokenId]
    rewardTokenPrice = prices[rewardToken.tokenId]
  }

  const weeklyRoi =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: poolData.provider,
    name: `${poolData.name} ${stakingToken.ticker}`,
    poolRewards: [rewardToken.ticker],
    links: poolData.links,
    risk: poolData.risk,
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: stakingToken.ticker, value: toDollar(stakingTokenPrice) },
      { label: rewardToken.ticker, value: toDollar(rewardTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedAmount * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourStakedAmount * stakingTokenPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(yourEarnedRewards, 4)} ${rewardToken.ticker}`,
        value: toDollar(yourEarnedRewards * rewardTokenPrice),
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
