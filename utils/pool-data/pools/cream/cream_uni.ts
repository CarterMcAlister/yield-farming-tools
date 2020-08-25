import { ethers } from 'ethers'
import {
  CREAM_REWARD_POOL_ABI,
  CREAM_TOKEN_ADDR,
  CREAM_UNI_POOL_ADDR,
  CREAM_WETH_UNI_TOKEN_ADDR,
  ERC20_ABI,
  UNISWAP_V2_PAIR_ABI,
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
  name: 'Uniswap Cream/Eth',
  added: '2020-08-23 20:31:52',
  links: [
    {
      title: 'Info',
      link:
        'https://twitter.com/CreamdotFinance/status/1296377883338792961?s=20',
    },
    {
      title: 'Pool',
      link:
        'https://app.uniswap.org/#/add/0x2ba592F78dB6436527729929AAf6c908497cB200/ETH',
    },
    {
      title: 'Staking',
      link: 'https://app.cream.finance/reward#Uniswap',
    },
  ],
}

export default async function main(App) {
  const CREAM_STAKING_POOL = new ethers.Contract(
    CREAM_UNI_POOL_ADDR,
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
  const CREAM_WETH_UNI_TOKEN = new ethers.Contract(
    CREAM_WETH_UNI_TOKEN_ADDR,
    UNISWAP_V2_PAIR_ABI,
    App.provider
  )

  const stakedUNIAmount =
    (await CREAM_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedCREAM = (await CREAM_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalUNIAmount = (await CREAM_WETH_UNI_TOKEN.totalSupply()) / 1e18
  const totalStakedUNIAmount =
    (await CREAM_WETH_UNI_TOKEN.balanceOf(CREAM_UNI_POOL_ADDR)) / 1e18
  const totalCREAMAmount =
    (await CREAM_TOKEN.balanceOf(CREAM_WETH_UNI_TOKEN_ADDR)) / 1e18
  const totalWETHAmount =
    (await WETH_TOKEN.balanceOf(CREAM_WETH_UNI_TOKEN_ADDR)) / 1e18

  const CREAMPerUNI = totalCREAMAmount / totalUNIAmount
  const WETHPerUNI = totalWETHAmount / totalUNIAmount

  const weekly_reward = await get_synth_weekly_rewards(CREAM_STAKING_POOL)

  const rewardPerToken = weekly_reward / totalStakedUNIAmount

  const prices = await lookUpPrices(['cream-2', 'ethereum'])
  const CREAMPrice = prices['cream-2'].usd
  const ETHPrice = prices['ethereum'].usd

  const UNIPrice = CREAMPerUNI * CREAMPrice + WETHPerUNI * ETHPrice

  const weeklyRoi = (rewardPerToken * CREAMPrice * 100) / UNIPrice

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
      { label: 'ETH', value: toDollar(ETHPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedUNIAmount * UNIPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          CREAMPerUNI * stakedUNIAmount * CREAMPrice +
            WETHPerUNI * stakedUNIAmount * ETHPrice
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
