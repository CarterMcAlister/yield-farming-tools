import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  ERC20_ABI,
  YFL_POOL_2_ADDR,
  YFL_TOKEN_ADDR,
  YFL_YCRV_BPT_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
  YCRV_TOKEN_ADDR,
} from '../../../constants'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const rewardTokenTicker = 'YFL'

  const YFL_POOL2 = new ethers.Contract(
    YFL_POOL_2_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFL_YCRV_BALANCER_POOL = new ethers.Contract(
    YFL_YCRV_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFL_YCRV_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFL_YCRV_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI,
    App.provider
  )

  const stakedBPTAmount = (await YFL_POOL2.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedAmount = (await YFL_POOL2.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFL_YCRV_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFL_YCRV_BPT_TOKEN_CONTRACT.balanceOf(YFL_POOL_2_ADDR)) / 1e18
  const totalYFLAmount =
    (await YFL_YCRV_BALANCER_POOL.getBalance(YFL_TOKEN_ADDR)) / 1e18
  const totalYCRVAmount =
    (await YFL_YCRV_BALANCER_POOL.getBalance(YCRV_TOKEN_ADDR)) / 1e18

  const YFLPerBPT = totalYFLAmount / totalBPTAmount
  const YCRVPerBPT = totalYCRVAmount / totalBPTAmount

  // Find out reward rate
  const weeklyReward = await get_synth_weekly_rewards(YFL_POOL2)
  const rewardPerToken = weeklyReward / totalStakedBPTAmount

  // Look up prices
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18
  const YFLPrice =
    ((await YFL_YCRV_BALANCER_POOL.getSpotPrice(
      YCRV_TOKEN_ADDR,
      YFL_TOKEN_ADDR
    )) /
      1e18) *
    YVirtualPrice

  const BPTPrice = YFLPerBPT * YFLPrice + YCRVPerBPT * YVirtualPrice
  const weeklyROI = (rewardPerToken * YFLPrice * 100) / BPTPrice

  return {
    provider: 'YFLink',
    name: 'yCRV/YFL Balancer',
    poolRewards: [rewardTokenTicker],
    apr: toFixed(weeklyROI * 52, 4),
    prices: [
      { label: 'YFL', value: toDollar(YFLPrice) },
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
            YCRVPerBPT * stakedBPTAmount * YVirtualPrice
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
          'https://gov.yflink.io/t/mining-yfl-in-pool-2-ycrv-yfl-balancer/26',
      },
      {
        title: 'Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0x8194EFab90A290b987616F687Bc380b041A2Cc25',
      },
      {
        title: 'Staking',
        link: 'https://yflink.io/#/',
      },
    ],
  }
}
