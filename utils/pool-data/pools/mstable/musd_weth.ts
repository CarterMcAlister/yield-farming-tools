import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MSTABLE_REWARDS_POOL_ABI,
  MUSD_TOKEN_ADDR,
  MUSD_WETH_BPT_TOKEN_ADDR,
  MUSD_WETH_BPT_TOKEN_STAKING_ADDR,
  WETH_TOKEN_ADDR,
} from '../../../constants'
import { priceLookupService } from '../../../price-lookup-service'
import { RiskLevel } from '../../../types'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const MUSD_WETH_BALANCER_POOL = new ethers.Contract(
    MUSD_WETH_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const MUSD_WETH_BPT_TOKEN_CONTRACT = new ethers.Contract(
    MUSD_WETH_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const BPT_STAKING_POOL = new ethers.Contract(
    MUSD_WETH_BPT_TOKEN_STAKING_ADDR,
    MSTABLE_REWARDS_POOL_ABI,
    App.provider
  )

  const totalBPTAmount = (await MUSD_WETH_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await MUSD_WETH_BPT_TOKEN_CONTRACT.balanceOf(
      MUSD_WETH_BPT_TOKEN_STAKING_ADDR
    )) / 1e18
  const yourBPTAmount =
    (await BPT_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalWETHAmount =
    (await MUSD_WETH_BALANCER_POOL.getBalance(WETH_TOKEN_ADDR)) / 1e18
  const totalMUSDAmount =
    (await MUSD_WETH_BALANCER_POOL.getBalance(MUSD_TOKEN_ADDR)) / 1e18

  const WETHPerBPT = totalWETHAmount / totalBPTAmount
  const MUSDPerBPT = totalMUSDAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(BPT_STAKING_POOL)
  const MTARewardPerBPT = weekly_reward / totalStakedBPTAmount

  const {
    musd: MUSDPrice,
    meta: MTAPrice,
    weth: WETHPrice,
  } = await priceLookupService.getPrices(['musd', 'meta', 'weth'])

  const BPTPrice = WETHPerBPT * WETHPrice + MUSDPerBPT * MUSDPrice

  // Finished. Start printing

  const weeklyRoi = (MTARewardPerBPT * MTAPrice * 100) / BPTPrice

  return {
    provider: 'mStable',
    name: 'Balancer mUSD-WETH',
    poolRewards: ['MTA', 'BAL'],
    risk: {
      smartContract: RiskLevel.LOW,
      impermanentLoss: RiskLevel.HIGH,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'MTA', value: toDollar(MTAPrice) },
      { label: 'mUSD', value: toDollar(MUSDPrice) },
      { label: 'WETH', value: toDollar(WETHPrice) },
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
          'https://pools.balancer.exchange/#/pool/0xe036CCE08cf4E23D33bC6B18e53Caf532AFa8513',
      },
      {
        title: 'Stake',
        link: 'https://app.mstable.org/earn',
      },
    ],
  }
}
