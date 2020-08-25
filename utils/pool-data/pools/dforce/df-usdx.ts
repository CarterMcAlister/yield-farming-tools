import axios from 'axios'
import { ethers } from 'ethers'
import { DF_USDX_UNISWAP_POOL_ABI } from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { RiskLevel } from '../../../../types'
import { toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const DFORCE_WEEKLY_REWARDS = 255000

  const DF_USDX_UNISWAP_POOL = new ethers.Contract(
    '0xfe7308d6ba8a64a189074f3c83a6cc56fc13b3af',
    DF_USDX_UNISWAP_POOL_ABI,
    App.provider
  )

  const totalPoolAmount = (await DF_USDX_UNISWAP_POOL.totalSupply()) / 1e18
  const yourPoolAmount =
    (await DF_USDX_UNISWAP_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const poolReserves = await DF_USDX_UNISWAP_POOL.getReserves()
  const poolDFORCEAmount = poolReserves[0] / 1e18
  const poolUSDXAmount = poolReserves[1] / 1e18

  const USDXPerTotal = poolUSDXAmount / totalPoolAmount
  const DFORCEPerTotal = poolDFORCEAmount / totalPoolAmount

  const rewardsPerPoolShare = DFORCE_WEEKLY_REWARDS / totalPoolAmount

  const roi = await axios.get('https://testapi.dforce.network/api/getRoi/')
  const yearlyRoi = roi.data['DF/USDx'] * 100
  const weeklyRoi = yearlyRoi / 52

  // Prices
  const {
    'usdx-stablecoin': USDXPrice,
    'dforce-token': dForcePrice,
  } = await priceLookupService.getPrices(['usdx-stablecoin', 'dforce-token'])

  const poolSharePrice = USDXPerTotal * USDXPrice + DFORCEPerTotal * dForcePrice
  return {
    provider: 'dForce',
    name: 'Uniswap DF-USDx',
    poolRewards: ['DF'],
    risk: {
      smartContract: RiskLevel.MEDIUM,
      impermanentLoss: RiskLevel.HIGH,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'USDX', value: toDollar(USDXPrice) },
      { label: 'DF', value: toDollar(dForcePrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalPoolAmount * poolSharePrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourPoolAmount * poolSharePrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(rewardsPerPoolShare * yourPoolAmount, 2)} DF`,
        value: toDollar(rewardsPerPoolShare * yourPoolAmount * dForcePrice),
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
          'https://app.uniswap.org/#/add/0xeb269732ab75a6fd61ea60b06fe994cd32a83549/0x431ad2ff6a9c365805ebad47ee021148d6f7dbe0',
      },
      {
        title: 'dForce Staking',
        link: 'https://staking.dforce.network/dapp',
      },
    ],
  }
}
