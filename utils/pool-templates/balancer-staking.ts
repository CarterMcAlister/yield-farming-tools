import { ethers } from 'ethers'
import { priceLookupService } from '../../services/price-lookup-service'
import { PoolData, TokenData } from '../../types'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../utils'
import { YCRV_TOKEN as yCrvToken } from '../../data/token-data'

export async function getSnxBasedBalPool(
  App,
  poolToken1: TokenData,
  poolToken2: TokenData,
  rewardToken: TokenData,
  balPoolToken: TokenData,
  rewardStakingPool: TokenData,
  poolData: PoolData
) {
  const STAKING_POOL = new ethers.Contract(
    rewardStakingPool.address,
    rewardStakingPool.ABI,
    App.provider
  )

  const BAL_POOL = new ethers.Contract(
    balPoolToken.address,
    balPoolToken.ABI,
    App.provider
  )

  const POOL_TOKEN_1 = new ethers.Contract(
    poolToken1.address,
    poolToken1.ABI,
    App.provider
  )

  const REWARD_TOKEN = new ethers.Contract(
    rewardToken.address,
    rewardToken.ABI,
    App.provider
  )

  let scalingFactor

  try {
    scalingFactor = await REWARD_TOKEN.yamsScalingFactor()
  } catch (e) {}

  const totalTokenOneInBalPool =
    (await POOL_TOKEN_1.balanceOf(balPoolToken.address)) / 1e18
  const totalRewardTokenInBalPool =
    (await REWARD_TOKEN.balanceOf(balPoolToken.address)) / 1e18

  const stakedBalTokens =
    (await STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalSupplyOfStakingToken = (await BAL_POOL.totalSupply()) / 1e18
  const totalStakedBalTokens =
    (await BAL_POOL.balanceOf(rewardStakingPool.address)) / 1e18

  let weeklyReward
  let yourEarnedRewards
  if (scalingFactor) {
    weeklyReward =
      ((await get_synth_weekly_rewards(STAKING_POOL)) * scalingFactor) / 1e18
    yourEarnedRewards =
      ((scalingFactor / 1e18) * (await STAKING_POOL.earned(App.YOUR_ADDRESS))) /
      1e18
  } else {
    weeklyReward = await get_synth_weekly_rewards(STAKING_POOL)
    yourEarnedRewards = (await STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  }

  const rewardPerToken = weeklyReward / totalStakedBalTokens

  const prices = await priceLookupService.getPrices([
    poolToken1.tokenId,
    rewardToken.tokenId,
  ])
  const poolToken1Price = prices[poolToken1.tokenId]
  const rewardTokenPrice = prices[rewardToken.tokenId]

  const stakingTokenPrice =
    (totalRewardTokenInBalPool * rewardTokenPrice +
      totalTokenOneInBalPool * poolToken1Price) /
    totalSupplyOfStakingToken

  const weeklyRoi =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: poolData.provider,
    name: `${poolData.name} ${poolToken1.ticker}/${rewardToken.ticker}`,
    poolRewards: [rewardToken.ticker],
    links: poolData.links,
    risk: poolData.risk,
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: poolToken1.ticker, value: toDollar(poolToken1Price) },
      { label: rewardToken.ticker, value: toDollar(rewardTokenPrice) },
      { label: balPoolToken.ticker, value: toDollar(stakingTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedBalTokens * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedBalTokens * stakingTokenPrice),
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
