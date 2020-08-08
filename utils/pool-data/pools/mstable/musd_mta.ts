import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MSTABLE_REWARDS_POOL_ABI,
  MTA_TOKEN_ADDR,
  MUSD_MTA_BPT_TOKEN_ADDR,
  MUSD_MTA_BPT_TOKEN_STAKING_ADDR,
  MUSD_TOKEN_ADDR,
} from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const MUSD_MTA_BALANCER_POOL = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const MUSD_MTA_BPT_TOKEN_CONTRACT = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const BPT_STAKING_POOL = new ethers.Contract(
    MUSD_MTA_BPT_TOKEN_STAKING_ADDR,
    MSTABLE_REWARDS_POOL_ABI,
    App.provider
  )
  const totalStakedBPTAmount =
    (await MUSD_MTA_BPT_TOKEN_CONTRACT.balanceOf(
      MUSD_MTA_BPT_TOKEN_STAKING_ADDR
    )) / 1e18

  const totalBPTAmount = (await MUSD_MTA_BALANCER_POOL.totalSupply()) / 1e18
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
  const prices = await lookUpPrices(['musd', 'meta'])
  const MTAPrice = prices['meta'].usd
  const MUSDPrice = prices['musd'].usd

  const BPTPrice = MTAPerBPT * MTAPrice + MUSDPerBPT * MUSDPrice

  const YFIWeeklyROI = (MTARewardPerBPT * MTAPrice * 100) / BPTPrice

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
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
        value: `${toFixed(YFIWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(YFIWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(YFIWeeklyROI, 4)}%`,
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
          'https://pools.balancer.exchange/#/pool/0xa5DA8Cc7167070B62FdCB332EF097A55A68d8824',
      },
      {
        title: 'Stake',
        link: 'https://app.mstable.org/earn',
      },
    ],
  }
}
