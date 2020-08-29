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
  wethTokenData: TokenData,
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

  //   const REWARD_TOKEN = new ethers.Contract(
  //     rewardToken.address,
  //     rewardToken.ABI,
  //     App.provider
  //   )

  const WETH_TOKEN = new ethers.Contract(
    wethTokenData.address,
    wethTokenData.ABI,
    App.provider
  )

  const rewardPerBlock = await REWARD_POOL.sushiPerBlock()
  const weeklyReward = Math.round(rewardPerBlock * (604800 / 18.75)) / 1e18

  let totalTokenOneInUniPool =
    (await POOL_TOKEN_1.balanceOf(uniPoolToken.address)) /
    (poolToken1?.numBase || 1e18)

  const totalEthInUniPool =
    (await WETH_TOKEN.balanceOf(uniPoolToken.address)) / 1e18

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
    ethereum: ethPrice,
  } = await priceLookupService.getPrices([
    rewardToken.tokenId,
    poolToken1.tokenId,
    'ethereum',
  ])

  const stakingTokenPrice =
    (totalEthInUniPool * ethPrice + totalTokenOneInUniPool * token1Price) /
    totalSupplyOfStakingToken

  let weeklyRoi = (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice
  if (poolToken1.ticker === 'SUSHI') {
    weeklyRoi = weeklyRoi * 2
  }

  return {
    provider: poolData.provider,
    name: `${poolData.name} ${poolToken1.ticker}/ETH`,
    poolRewards: [rewardToken.ticker],
    links: poolData.links,
    risk: poolData.risk,
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: poolToken1.ticker, value: toDollar(token1Price) },
      { label: 'ETH', value: toDollar(ethPrice) },
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
