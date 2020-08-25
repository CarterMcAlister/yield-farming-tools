import { ethers } from 'ethers'
import {
  ERC20_ABI,
  iETH_TOKEN_ADDR,
  SYNTH_iETH_STAKING_POOL_ABI,
  SYNTH_iETH_STAKING_POOL_ADDR,
} from '../../../../data/constants'
import { get_synth_weekly_rewards, lookUpPrices, toFixed } from '../../../utils'

export default async function main(App) {
  const SYNTH_iETH_POOL = new ethers.Contract(
    SYNTH_iETH_STAKING_POOL_ADDR,
    SYNTH_iETH_STAKING_POOL_ABI,
    App.provider
  )
  const iETH_CONTRACT = new ethers.Contract(
    iETH_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const yourStakedIETHAmount =
    (await SYNTH_iETH_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedSNX = (await SYNTH_iETH_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalIETHAmount = (await iETH_CONTRACT.totalSupply()) / 1e18
  const totalStakedIETHAmount =
    (await iETH_CONTRACT.balanceOf(SYNTH_iETH_STAKING_POOL_ADDR)) / 1e18

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(SYNTH_iETH_POOL)
  const rewardPerToken = weekly_reward / totalStakedIETHAmount

  // Look up prices
  const prices = await lookUpPrices(['havven', 'ieth'])
  const SNXprice = prices.havven.usd
  const iETHprice = prices.ieth.usd

  const SNXWeeklyROI = (rewardPerToken * SNXprice * 100) / iETHprice

  return {
    apr: toFixed(SNXWeeklyROI * 52, 4),
  }
}
