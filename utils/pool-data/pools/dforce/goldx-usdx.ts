import axios from 'axios'
import { ethers } from 'ethers'
import { GOLDX_USDX_UNISWAP_POOL_ABI } from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { RiskLevel } from '../../../../types'
import { toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const DFORCE_WEEKLY_REWARDS = 76000

  const GOLDX_USDX_UNISWAP_POOL = new ethers.Contract(
    '0xef6317e783b22b2a2fc073e68260450236c20779',
    GOLDX_USDX_UNISWAP_POOL_ABI,
    App.provider
  )

  const totalPoolAmount = (await GOLDX_USDX_UNISWAP_POOL.totalSupply()) / 1e18
  const yourPoolAmount =
    (await GOLDX_USDX_UNISWAP_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const rewardsPerPoolShare = DFORCE_WEEKLY_REWARDS / totalPoolAmount

  const roi = await axios.get('https://testapi.dforce.network/api/getRoi/')
  const yearlyRoi = roi.data['GOLDx/USDx'] * 100
  const weeklyRoi = yearlyRoi / 52

  // Prices
  const {
    'usdx-stablecoin': USDXPrice,
    'dforce-token': DFORCEPrice,
  } = await priceLookupService.getPrices(['usdx-stablecoin', 'dforce-token'])
  const goldxData = await axios.get(
    'https://goldx.dforce.network/api/goldx/getPrice/'
  )
  const GOLDXPrice = goldxData.data.price

  return {
    provider: 'dForce',
    name: 'Uniswap GOLDx-USDx',
    poolRewards: ['DF'],
    risk: {
      smartContract: RiskLevel.MEDIUM,
      impermanentLoss: RiskLevel.HIGH,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'USDX', value: toDollar(USDXPrice) },
      { label: 'DF', value: toDollar(DFORCEPrice) },
      { label: 'GOLDX', value: toDollar(GOLDXPrice) },
    ],
    staking: [],
    rewards: [
      {
        label: `${toFixed(rewardsPerPoolShare * yourPoolAmount, 2)} DF`,
        value: toDollar(rewardsPerPoolShare * yourPoolAmount * DFORCEPrice),
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
    links: [
      {
        title: 'Info',
        link:
          'https://medium.com/dforcenet/dforce-kicks-off-liquidity-mining-starting-from-22-00-utc-8-august-3-2020-d066698c4dc4',
      },
      {
        title: 'Uniswap Pool',
        link:
          'https://app.uniswap.org/#/add/0x355c665e101b9da58704a8fddb5feef210ef20c0/0xeb269732ab75a6fd61ea60b06fe994cd32a83549',
      },
      {
        title: 'dForce Staking',
        link: 'https://staking.dforce.network',
      },
    ],
  }
}
