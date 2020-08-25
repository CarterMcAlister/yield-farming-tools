import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MSTABLE_REWARDS_POOL_ABI,
  MTA_TOKEN_ADDR,
  MUSD_MTA_BPT_TOKEN_2_ADDR,
  MUSD_MTA_BPT_TOKEN_2_STAKING_ADDR,
  MUSD_TOKEN_ADDR,
} from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { RiskLevel } from '../../../../types'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const MUSD_MTA_BALANCER_POOL = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_2_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const MUSD_MTA_BPT_TOKEN_CONTRACT = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_2_ADDR,
    ERC20_ABI,
    App.provider
  )
  const BPT_STAKING_POOL = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_2_STAKING_ADDR,
    MSTABLE_REWARDS_POOL_ABI,
    App.provider
  )

  const totalBPTAmount = (await MUSD_MTA_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await MUSD_MTA_BPT_TOKEN_CONTRACT.balanceOf(
      MUSD_MTA_BPT_TOKEN_2_STAKING_ADDR
    )) / 1e18
  const yourBPTAmount =
    (await BPT_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalMTAAmount =
    (await MUSD_MTA_BALANCER_POOL.getBalance(MTA_TOKEN_ADDR)) / 1e18
  const totalMUSDAmount =
    (await MUSD_MTA_BALANCER_POOL.getBalance(MUSD_TOKEN_ADDR)) / 1e18

  const MTAPerBPT = totalMTAAmount / totalBPTAmount
  const MUSDPerBPT = totalMUSDAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(BPT_STAKING_POOL)
  const MTARewardPerBPT = weekly_reward / totalStakedBPTAmount

  // Look up prices
  const {
    musd: MUSDPrice,
    meta: MTAPrice,
  } = await priceLookupService.getPrices(['musd', 'meta'])

  const BPTPrice = MTAPerBPT * MTAPrice + MUSDPerBPT * MUSDPrice

  const weeklyRoi = (MTARewardPerBPT * MTAPrice * 100) / BPTPrice

  return {
    provider: 'mStable',
    name: 'mUSD-MTA 95-5',
    poolRewards: ['MTA', 'BAL'],
    risk: {
      smartContract: RiskLevel.LOW,
      impermanentLoss: RiskLevel.LOW,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'MTA', value: toDollar(MTAPrice) },
      { label: 'mUSD', value: toDollar(MUSDPrice) },
      { label: 'BPT', value: toDollar(BPTPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourBPTAmount * BPTPrice),
      },
    ],
    rewards: [],
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
    links: [
      {
        title: 'Info',
        link:
          'https://medium.com/mstable/introducing-mstable-earn-6ac5f4e7560e',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0xa5da8cc7167070b62fdcb332ef097a55a68d8824',
      },
      {
        title: 'Stake',
        link: 'https://app.mstable.org/earn',
      },
    ],
  }
}
