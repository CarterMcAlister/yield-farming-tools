import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CREAM_BPT_POOL_ADDR,
  CREAM_REWARD_POOL_ABI,
  CREAM_TOKEN_ADDR,
  CREAM_WETH_BPT_TOKEN_ADDR,
  ERC20_ABI,
  WETH_TOKEN_ADDR,
} from '../../../../data/constants'
import { PoolData, RiskLevel } from '../../../../types'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

const poolData: PoolData = {
  provider: 'Cream',
  name: 'Balancer Cream/wEth',
  added: '2020-08-23 20:31:51',
  links: [
    {
      title: 'Info',
      link:
        'https://twitter.com/CreamdotFinance/status/1296377883338792961?s=20',
    },
    {
      title: 'Pool',
      link:
        'https://pools.balancer.exchange/#/pool/0xCcD5cb3401704AF8462a4FFE708a180d3C5c4Da0/',
    },
    {
      title: 'Staking',
      link: 'https://app.cream.finance/reward#Balancer',
    },
  ],
}

export default async function main(App) {
  const CREAM_STAKING_POOL = new ethers.Contract(
    CREAM_BPT_POOL_ADDR,
    CREAM_REWARD_POOL_ABI,
    App.provider
  )
  const CREAM_TOKEN = new ethers.Contract(
    CREAM_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const WETH_TOKEN = new ethers.Contract(
    WETH_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const CREAM_WETH_BPT_TOKEN = new ethers.Contract(
    CREAM_WETH_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )

  const stakedAmount =
    (await CREAM_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedCREAM = (await CREAM_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await CREAM_WETH_BPT_TOKEN.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await CREAM_WETH_BPT_TOKEN.balanceOf(CREAM_BPT_POOL_ADDR)) / 1e18
  const totalCREAMAmount =
    (await CREAM_TOKEN.balanceOf(CREAM_WETH_BPT_TOKEN_ADDR)) / 1e18
  const totalWETHAmount =
    (await WETH_TOKEN.balanceOf(CREAM_WETH_BPT_TOKEN_ADDR)) / 1e18

  const CREAMPerBPT = totalCREAMAmount / totalBPTAmount
  const WETHPerBPT = totalWETHAmount / totalBPTAmount

  const weekly_reward = await get_synth_weekly_rewards(CREAM_STAKING_POOL)

  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  const prices = await lookUpPrices(['cream-2', 'ethereum'])
  const CREAMPrice = prices['cream-2'].usd
  const ETHPrice = prices['ethereum'].usd

  const BPTPrice = CREAMPerBPT * CREAMPrice + WETHPerBPT * ETHPrice

  const weeklyRoi = (rewardPerToken * CREAMPrice * 100) / BPTPrice

  return {
    ...poolData,
    poolRewards: ['CREAM'],
    risk: {
      smartContract: RiskLevel.HIGH,
      impermanentLoss: RiskLevel.HIGH,
    },
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'CREAM', value: toDollar(CREAMPrice) },
      { label: 'WETH', value: toDollar(ETHPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          CREAMPerBPT * stakedAmount * CREAMPrice +
            WETHPerBPT * stakedAmount * ETHPrice
        ),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedCREAM, 4)} CREAM`,
        value: toDollar(earnedCREAM * CREAMPrice),
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
  }
}
