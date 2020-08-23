import axios from 'axios'
import { priceLookupService } from '../../../price-lookup-service'
import { toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const poolValues = await axios.get(
    'https://markets.dforce.network/api/v1/getApy/?net=main'
  )
  const poolValue =
    parseFloat(poolValues.data.dDAI.net_value) +
    parseFloat(poolValues.data.dUSDC.net_value) +
    parseFloat(poolValues.data.dUSDT.net_value)

  const roi = await axios.get('https://testapi.dforce.network/api/getRoi/')
  const yearlyRoi =
    ((roi.data.dDAI + roi.data.dUSDC + roi.data.dUSDT) / 3) * 100
  const weeklyRoi = yearlyRoi / 52

  const {
    tether: USDTPrice,
    'usd-coin': USDCPrice,
    dai: DAIPrice,
  } = await priceLookupService.getPrices(['tether', 'usd-coin', 'dai'])

  return {
    provider: 'dForce',
    name: 'dUSDT/dUSDC/dDAI',
    poolRewards: ['DF'],
    risk: {
      smartContract: RiskLevel.MEDIUM,
      impermanentLoss: RiskLevel.NONE,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'USDT', value: toDollar(USDTPrice) },
      { label: 'USDC', value: toDollar(USDCPrice) },
      { label: 'DAI', value: toDollar(DAIPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(poolValue),
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
          'https://medium.com/dforcenet/dforce-kicks-off-liquidity-mining-starting-from-22-00-utc-8-august-3-2020-d066698c4dc4',
      },
      {
        title: 'Mint',
        link: 'https://markets.dforce.network/',
      },
      {
        title: 'dForce Staking',
        link: 'https://staking.dforce.network',
      },
    ],
  }
}
