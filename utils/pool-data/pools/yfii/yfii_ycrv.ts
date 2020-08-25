import { ethers } from 'ethers'
import {
  ERC20_ABI,
  YCRV_TOKEN_ADDR,
  YFII_STAKING_POOL_ADDR,
  Y_STAKING_POOL_ABI,
} from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { RiskLevel } from '../../../../types'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const Y_STAKING_POOL = new ethers.Contract(
    YFII_STAKING_POOL_ADDR,
    Y_STAKING_POOL_ABI,
    App.provider
  )

  const Y_TOKEN = new ethers.Contract(YCRV_TOKEN_ADDR, ERC20_ABI, App.provider)

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalStakedYAmount =
    (await Y_TOKEN.balanceOf(YFII_STAKING_POOL_ADDR)) / 1e18

  const weekly_reward = await get_synth_weekly_rewards(Y_STAKING_POOL)

  const rewardPerToken = weekly_reward / totalStakedYAmount

  const {
    'yfii-finance': YFIIPrice,
    'curve-fi-ydai-yusdc-yusdt-ytusd': YVirtualPrice,
  } = await priceLookupService.getPrices([
    'yfii-finance',
    'curve-fi-ydai-yusdc-yusdt-ytusd',
  ])

  const YFIWeeklyROI = (rewardPerToken * YFIIPrice * 100) / YVirtualPrice

  return {
    provider: 'yfii.finance',
    name: 'Curve yCRV',
    poolRewards: ['YFII', 'CRV'],
    risk: {
      smartContract: RiskLevel.MEDIUM,
      impermanentLoss: RiskLevel.NONE,
    },
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YFII', value: toDollar(YFIIPrice) },
      {
        label: 'yCRV',
        value: toDollar(YVirtualPrice),
      },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedYAmount * YVirtualPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedYAmount * YVirtualPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedYFI, 4)} YFII`,
        value: toDollar(earnedYFI * YFIIPrice),
      },
    ],
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
        title: 'Instructions',
        link:
          'https://yfii.s3-ap-northeast-1.amazonaws.com/YFII_Innovative_DeFi_Yield_Farming_Token.pdf',
      },
      {
        title: 'Curve Pool',
        link: 'https://www.curve.fi/iearn/deposit',
      },
      {
        title: 'Staking',
        link: 'https://www.yfii.finance/#/stake',
      },
      {
        title: 'Token',
        link:
          'https://etherscan.io/address/0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
      },
    ],
  }
}
