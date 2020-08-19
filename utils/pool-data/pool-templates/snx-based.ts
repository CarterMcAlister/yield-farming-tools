import { ethers } from 'ethers'
import { priceLookupService } from '../../price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../utils'
import { YCRV_TOKEN as yCrvToken } from '../pool-templates/token-data'

export type TokenData = {
  address: string
  ABI: any
  ticker?: string
  tokenId?: string
}
export type PoolData = {
  provider: string
  name: string
  links: Array<Object>
  added: string
}

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
  console.log(weekly_reward, totalStakedAmount, scalingFactor)
  let stakingTokenPrice
  let rewardTokenPrice
  if (!rewardToken.tokenId) {
    // Can't get price from gecko
    console.log(' Cant get price from gecko')
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

export async function getSnxBasedUniPoolStakingData(
  App,
  poolToken1: TokenData,
  rewardToken: TokenData,
  uniPoolToken: TokenData,
  rewardStakingPool: TokenData,
  poolData: PoolData,
  pricePoolAddress?: string
) {
  const REWARD_POOL = new ethers.Contract(
    rewardStakingPool.address,
    rewardStakingPool.ABI,
    App.provider
  )

  const UNI_POOL = new ethers.Contract(
    uniPoolToken.address,
    uniPoolToken.ABI,
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

  const totalTokenOneInUniPool =
    (await POOL_TOKEN_1.balanceOf(uniPoolToken.address)) / 1e18
  const totalRewardTokenInUniPool =
    (await REWARD_TOKEN.balanceOf(uniPoolToken.address)) / 1e18

  const stakedUniTokens = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalSupplyOfStakingToken = (await UNI_POOL.totalSupply()) / 1e18
  const totalStakedUniTokens =
    (await UNI_POOL.balanceOf(rewardStakingPool.address)) / 1e18

  let weeklyReward
  let yourEarnedRewards
  if (scalingFactor) {
    weeklyReward =
      ((await get_synth_weekly_rewards(REWARD_POOL)) * scalingFactor) / 1e18
    yourEarnedRewards =
      ((scalingFactor / 1e18) * (await REWARD_POOL.earned(App.YOUR_ADDRESS))) /
      1e18
  } else {
    weeklyReward = await get_synth_weekly_rewards(REWARD_POOL)
    yourEarnedRewards = (await REWARD_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  }

  const rewardPerToken = weeklyReward / totalStakedUniTokens

  let poolToken1Price
  let rewardTokenPrice
  if (!rewardToken.tokenId) {
    // Can't get price from gecko
    console.log(' Cant get price from gecko')
    const prices = await priceLookupService.getPrices([
      poolToken1.tokenId,
      yCrvToken.tokenId,
    ])
    poolToken1Price = prices[poolToken1.tokenId]
    rewardTokenPrice =
      (prices[yCrvToken.tokenId] *
        ((await POOL_TOKEN_1.balanceOf(pricePoolAddress)) / 1e18)) /
      ((await REWARD_TOKEN.balanceOf(pricePoolAddress)) / 1e18)
  } else {
    const prices = await priceLookupService.getPrices([
      poolToken1.tokenId,
      rewardToken.tokenId,
    ])
    poolToken1Price = prices[poolToken1.tokenId]
    rewardTokenPrice = prices[rewardToken.tokenId]
  }

  const stakingTokenPrice =
    (totalRewardTokenInUniPool * rewardTokenPrice +
      totalTokenOneInUniPool * poolToken1Price) /
    totalSupplyOfStakingToken

  const weeklyRoi =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: poolData.provider,
    name: `${poolData.name} ${poolToken1.ticker}/${rewardToken.ticker}`,
    poolRewards: [rewardToken.ticker],
    links: poolData.links,
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: poolToken1.ticker, value: toDollar(poolToken1Price) },
      { label: rewardToken.ticker, value: toDollar(rewardTokenPrice) },
      { label: uniPoolToken.ticker, value: toDollar(stakingTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedUniTokens * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedUniTokens * stakingTokenPrice),
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
