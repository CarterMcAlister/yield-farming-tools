import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toFixed,
  toDollar,
} from '../../../utils'
import { ethers } from 'ethers'
import {
  MUSD_MTA_BPT_TOKEN_ADDR,
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MTA_TOKEN_ADDR,
  MUSD_TOKEN_ADDR,
} from '../../../constants'

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

  const totalBPTAmount = (await MUSD_MTA_BALANCER_POOL.totalSupply()) / 1e18
  const yourBPTAmount =
    (await MUSD_MTA_BPT_TOKEN_CONTRACT.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalMTAAmount =
    (await MUSD_MTA_BALANCER_POOL.getBalance(MTA_TOKEN_ADDR)) / 1e18
  const totalMUSDAmount =
    (await MUSD_MTA_BALANCER_POOL.getBalance(MUSD_TOKEN_ADDR)) / 1e18

  const MTAPerBPT = totalMTAAmount / totalBPTAmount
  const MUSDPerBPT = totalMUSDAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = 50000
  const MTARewardPerBPT = weekly_reward / (totalBPTAmount - 100)

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
        link: 'https://medium.com/mstable/a-recap-of-mta-rewards-9729356a66dd',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0x003a70265a3662342010823bEA15Dc84C6f7eD54',
      },
    ],
  }
}
