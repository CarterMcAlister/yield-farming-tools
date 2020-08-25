import { ethers } from 'ethers'
import {
  ALINK_TOKEN_ADDR,
  BALANCER_POOL_ABI,
  ERC20_ABI,
  YFL_ALINK_BPT_TOKEN_ADDR,
  YFL_POOL_3_ADDR,
  YFL_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
} from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'
import { RiskLevel } from '../../../../types'

export default async function main(App) {
  const rewardTokenTicker = 'YFL'

  const YFL_POOL3 = new ethers.Contract(
    YFL_POOL_3_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFL_ALINK_BALANCER_POOL = new ethers.Contract(
    YFL_ALINK_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFL_ALINK_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFL_ALINK_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount = (await YFL_POOL3.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedAmount = (await YFL_POOL3.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFL_ALINK_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFL_ALINK_BPT_TOKEN_CONTRACT.balanceOf(YFL_POOL_3_ADDR)) / 1e18
  const totalYFLAmount =
    (await YFL_ALINK_BALANCER_POOL.getBalance(YFL_TOKEN_ADDR)) / 1e18
  const totalALINKAmount =
    (await YFL_ALINK_BALANCER_POOL.getBalance(ALINK_TOKEN_ADDR)) / 1e18

  const YFLPerBPT = totalYFLAmount / totalBPTAmount
  const LINKPerBPT = totalALINKAmount / totalBPTAmount

  // Find out reward rate
  const weeklyReward = await get_synth_weekly_rewards(YFL_POOL3)
  const rewardPerToken = weeklyReward / totalStakedBPTAmount

  // Look up prices
  const {
    chainlink: LINKPrice,
    yflink: YFLPrice,
  } = await priceLookupService.getPrices(['chainlink', 'yflink'])

  const BPTPrice = YFLPerBPT * YFLPrice + LINKPerBPT * LINKPrice
  const weeklyROI = (rewardPerToken * YFLPrice * 100) / BPTPrice

  return {
    provider: 'YFLink',
    name: 'aLINK/YFL Balancer',
    poolRewards: [rewardTokenTicker],
    risk: {
      smartContract: RiskLevel.MEDIUM,
      impermanentLoss: RiskLevel.MEDIUM,
    },
    apr: toFixed(weeklyROI * 52, 4),
    prices: [
      { label: 'YFL', value: toDollar(YFLPrice) },
      { label: 'LINK', value: toDollar(LINKPrice) },
      { label: 'BPT', value: toDollar(BPTPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          YFLPerBPT * stakedBPTAmount * YFLPrice +
            LINKPerBPT * stakedBPTAmount * LINKPrice
        ),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedAmount, 4)} ${rewardTokenTicker}`,
        value: toDollar(earnedAmount * YFLPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(weeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(weeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(weeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Info',
        link:
          'https://gov.yflink.io/t/mining-yfl-in-pool-3-alink-yfl-balancer/27',
      },
      {
        title: 'Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0x08aC64EC9902635D18204a1a75DF0173Aea00057',
      },
      {
        title: 'Staking',
        link: 'https://yflink.io/#/',
      },
    ],
  }
}
