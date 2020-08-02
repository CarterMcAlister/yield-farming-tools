import { ethers } from 'ethers'
import {
  ERC20_ABI,
  iBTC_TOKEN_ADDR,
  SYNTH_iBTC_STAKING_POOL_ABI,
  SYNTH_iBTC_STAKING_POOL_ADDR,
} from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const SYNTH_iBTC_POOL = new ethers.Contract(
    SYNTH_iBTC_STAKING_POOL_ADDR,
    SYNTH_iBTC_STAKING_POOL_ABI,
    App.provider
  )
  const iBTC_CONTRACT = new ethers.Contract(
    iBTC_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const yourStakedIBTCAmount =
    (await SYNTH_iBTC_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedSNX = (await SYNTH_iBTC_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalIBTCAmount = (await iBTC_CONTRACT.totalSupply()) / 1e18
  const totalStakedIBTCAmount =
    (await iBTC_CONTRACT.balanceOf(SYNTH_iBTC_STAKING_POOL_ADDR)) / 1e18

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(SYNTH_iBTC_POOL)
  const rewardPerToken = weekly_reward / totalStakedIBTCAmount

  // Look up prices
  const prices = await lookUpPrices(['havven', 'ibtc'])
  const SNXPrice = prices.havven.usd
  const iBTCPrice = prices.ibtc.usd

  const SNXWeeklyROI = (rewardPerToken * SNXPrice * 100) / iBTCPrice

  return {
    apr: toFixed(SNXWeeklyROI * 52, 4),
    prices: [
      { label: 'SNX', value: toDollar(SNXPrice) },
      { label: 'iBTC', value: toDollar(iBTCPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedIBTCAmount * iBTCPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourStakedIBTCAmount * iBTCPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedSNX, 2)} SNX`,
        value: toDollar(earnedSNX * SNXPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(SNXWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(SNXWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(SNXWeeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Info',
        link: 'https://blog.synthetix.io/ieth-migration-and-ibtc-launch',
      },
      {
        title: 'Stake',
        link: 'https://mintr.synthetix.io/',
      },
      {
        title: 'Token',
        link: 'https://synthetix.exchange/trade/iBTC-sUSD',
      },
    ],
  }
}
