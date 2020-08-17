import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  LINK_TOKEN_ADDR,
  YFL_LINK_BPT_TOKEN_ADDR,
  YFL_POOL_1_ADDR,
  YFL_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
} from '../../../constants'
import { priceLookupService } from '../../../price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const rewardTokenTicker = 'YFL'

  const YFL_POOL1 = new ethers.Contract(
    YFL_POOL_1_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFL_LINK_BALANCER_POOL = new ethers.Contract(
    YFL_LINK_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFL_LINK_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFL_LINK_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const stakedAmount = (await YFL_POOL1.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedAmount = (await YFL_POOL1.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFL_LINK_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedAmount =
    (await YFL_LINK_BPT_TOKEN_CONTRACT.balanceOf(YFL_POOL_1_ADDR)) / 1e18
  const totalYFLAmount =
    (await YFL_LINK_BALANCER_POOL.getBalance(YFL_TOKEN_ADDR)) / 1e18
  const totalLINKAmount =
    (await YFL_LINK_BALANCER_POOL.getBalance(LINK_TOKEN_ADDR)) / 1e18

  const YFLPerBPT = totalYFLAmount / totalBPTAmount
  const LINKPerBPT = totalLINKAmount / totalBPTAmount

  // Find out reward rate
  const weeklyReward = await get_synth_weekly_rewards(YFL_POOL1)
  const rewardPerToken = weeklyReward / totalStakedAmount

  const {
    chainlink: LINKPrice,
    yflink: YFLPrice,
  } = await priceLookupService.getPrices(['chainlink', 'yflink'])

  const BPTPrice = YFLPerBPT * YFLPrice + LINKPerBPT * LINKPrice
  const weeklyROI = (rewardPerToken * YFLPrice * 100) / BPTPrice

  return {
    provider: 'YFLink',
    name: 'LINK/YFL Balancer',
    poolRewards: [rewardTokenTicker],
    apr: toFixed(weeklyROI * 52, 4),
    prices: [
      { label: 'LINK', value: toDollar(LINKPrice) },
      { label: 'YFL', value: toDollar(YFLPrice) },
      { label: 'BPT', value: toDollar(BPTPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          YFLPerBPT * stakedAmount * YFLPrice +
            LINKPerBPT * stakedAmount * LINKPrice
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
          'https://gov.yflink.io/t/mining-yfl-in-pool-1-link-yfl-balancer/25',
      },
      {
        title: 'Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0xc7062D899dd24b10BfeD5AdaAb21231a1e7708fE',
      },
      {
        title: 'Staking',
        link: 'https://yflink.io/#/',
      },
    ],
  }
}
