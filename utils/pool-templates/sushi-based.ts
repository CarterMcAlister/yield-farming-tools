import { ethers } from 'ethers'
import { priceLookupService } from '../../services/price-lookup-service'
import { PoolData, TokenData } from '../../types'
import { toDollar, toFixed } from '../utils'

export async function getSushiPoolData(
  App,
  poolToken1: TokenData,
  rewardToken: TokenData,
  uniPoolToken: TokenData,
  rewardStakingPool: TokenData,
  poolData: PoolData,
  poolToken2: TokenData,
  poolId
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

  const POOL_TOKEN_2 = new ethers.Contract(
    poolToken2.address,
    poolToken2.ABI,
    App.provider
  )
  const multiplier = await REWARD_POOL.BONUS_MULTIPLIER()
  const poolInfo = await REWARD_POOL.poolInfo(poolId)
  const rewardPerBlock = parseInt(poolInfo.allocPoint)

  const weeklyReward = rewardPerBlock * (604800 / 30)

  let totalTokenOneInUniPool =
    (await POOL_TOKEN_1.balanceOf(uniPoolToken.address)) /
    (poolToken1?.numBase || 1e18)
    

  const totalEthInUniPool =
    (await POOL_TOKEN_2.balanceOf(uniPoolToken.address)) / 1e18

  const totalStaked =
    (await UNI_POOL.balanceOf(rewardStakingPool.address)) / 1e18

  const userInfo = await REWARD_POOL.userInfo(poolId, App.YOUR_ADDRESS)

  const myStakedAmount = userInfo.amount / 1e18

  const totalSupplyOfStakingToken = (await UNI_POOL.totalSupply()) / 1e18

  const myRewards =
    (await REWARD_POOL.pendingSushi(poolId, App.YOUR_ADDRESS)) / 1e18

  const rewardPerToken = weeklyReward / totalStaked

  const {
    [rewardToken.tokenId]: rewardTokenPrice,
    [poolToken1.tokenId]: token1Price,
    [poolToken2.tokenId]: token2Price,
  } = await priceLookupService.getPrices([
    rewardToken.tokenId,
    poolToken1.tokenId,
    poolToken2.tokenId,
  ])

  const stakingTokenPrice =
    (totalEthInUniPool * token2Price + totalTokenOneInUniPool * token1Price) /
    totalSupplyOfStakingToken

  let weeklyRoi =
    (rewardPerToken * rewardTokenPrice * multiplier) / stakingTokenPrice

  return {
    provider: poolData.provider,
    name: `${poolData.name} ${poolToken1.ticker}/${poolToken2.ticker}`,
    poolRewards: [rewardToken.ticker],
    links: poolData.links,
    risk: poolData.risk,
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: poolToken1.ticker, value: toDollar(token1Price) },
      { label: poolToken2.ticker, value: toDollar(token2Price) },
      { label: rewardToken.ticker, value: toDollar(rewardTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStaked * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(myStakedAmount * stakingTokenPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(myRewards, 4)} ${rewardToken.ticker}`,
        value: toDollar(myRewards * rewardTokenPrice),
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
