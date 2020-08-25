import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MSTABLE_REWARDS_POOL_ABI,
  MTA_TOKEN_ADDR,
  MTA_WETH_UNI_TOKEN_ADDR,
  MTA_WETH_UNI_TOKEN_STAKING_ADDR,
  WETH_TOKEN_ADDR,
} from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const MUSD_WETH_UNISWAP_POOL = new ethers.Contract(
    MTA_WETH_UNI_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const MUSD_WETH_UNI_TOKEN_CONTRACT = new ethers.Contract(
    MTA_WETH_UNI_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const WETH_TOKEN = new ethers.Contract(
    WETH_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const MTA_TOKEN = new ethers.Contract(MTA_TOKEN_ADDR, ERC20_ABI, App.provider)
  const BPT_STAKING_POOL = new ethers.Contract(
    MTA_WETH_UNI_TOKEN_STAKING_ADDR,
    MSTABLE_REWARDS_POOL_ABI,
    App.provider
  )

  const totalBPTAmount = (await MUSD_WETH_UNISWAP_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await MUSD_WETH_UNI_TOKEN_CONTRACT.balanceOf(
      MTA_WETH_UNI_TOKEN_STAKING_ADDR
    )) / 1e18
  const yourBPTAmount =
    (await BPT_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalWETHAmount =
    (await WETH_TOKEN.balanceOf(MTA_WETH_UNI_TOKEN_ADDR)) / 1e18
  const totalMTAAmount =
    (await MTA_TOKEN.balanceOf(MTA_WETH_UNI_TOKEN_ADDR)) / 1e18

  const WETHPerBPT = totalWETHAmount / totalBPTAmount
  const MTAPerBPT = totalMTAAmount / totalBPTAmount

  const weekly_reward = await get_synth_weekly_rewards(BPT_STAKING_POOL)
  const MTARewardPerBPT = weekly_reward / totalStakedBPTAmount

  const {
    meta: MTAPrice,
    weth: WETHPrice,
  } = await priceLookupService.getPrices(['meta', 'weth'])

  const BPTPrice = WETHPerBPT * WETHPrice + MTAPerBPT * MTAPrice

  const weeklyRoi = (MTARewardPerBPT * MTAPrice * 100) / BPTPrice

  return {
    provider: 'mStable',
    name: 'Balancer MTA-wETH',
    poolRewards: ['MTA', 'BAL'],
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'MTA', value: toDollar(MTAPrice) },
      { label: 'wEth', value: toDollar(WETHPrice) },
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
          'https://pools.balancer.exchange/#/pool/0x0d0d65e7a7db277d3e0f5e1676325e75f3340455',
      },
      {
        title: 'Stake',
        link: 'https://app.mstable.org/earn',
      },
    ],
  }
}
