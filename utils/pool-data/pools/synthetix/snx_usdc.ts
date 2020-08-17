import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  BALANCER_USDC_SNX_POOL_ADDRESS,
  ERC20_ABI,
  SNX_TOKEN_ADDRESS,
  SNX_USDC_BPT_ADDRESS,
  SYNTH_USDC_SNX_BPT_STAKING_POOL_ABI,
  SYNTH_USDC_SNX_BPT_STAKING_POOL_ADDR,
  USDC_TOKEN_ADDR,
} from '../../../constants'
import {
  getLatestTotalBALAmount,
  get_synth_weekly_rewards,
  lookUpPrices,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const SYNTH_BPT_POOL = new ethers.Contract(
    SYNTH_USDC_SNX_BPT_STAKING_POOL_ADDR,
    SYNTH_USDC_SNX_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const SNX_USDC_BALANCER_POOL = new ethers.Contract(
    BALANCER_USDC_SNX_POOL_ADDRESS,
    BALANCER_POOL_ABI,
    App.provider
  )
  const SNX_USDC_BPT_TOKEN_CONTRACT = new ethers.Contract(
    SNX_USDC_BPT_ADDRESS,
    ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount =
    (await SYNTH_BPT_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedSNX = (await SYNTH_BPT_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await SNX_USDC_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await SNX_USDC_BPT_TOKEN_CONTRACT.balanceOf(
      SYNTH_USDC_SNX_BPT_STAKING_POOL_ADDR
    )) / 1e18
  const totalSNXAmount =
    (await SNX_USDC_BALANCER_POOL.getBalance(SNX_TOKEN_ADDRESS)) / 1e18
  const totalUSDCAmount =
    (await SNX_USDC_BALANCER_POOL.getBalance(USDC_TOKEN_ADDR)) / 1e6

  const SNXperBPT = totalSNXAmount / totalBPTAmount
  const USDCperBPT = totalUSDCAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(SYNTH_BPT_POOL)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  // Look up prices
  const prices = await lookUpPrices(['havven', 'usd-coin', 'balancer'])
  const SNXPrice = prices.havven.usd
  const USDCPrice = prices['usd-coin'].usd
  const BALPrice = prices.balancer.usd

  const BPTPrice = SNXperBPT * SNXPrice + USDCperBPT * USDCPrice

  const SNXWeeklyROI = (rewardPerToken * SNXPrice * 100) / BPTPrice

  const totalBALAmount = await getLatestTotalBALAmount(
    SYNTH_USDC_SNX_BPT_STAKING_POOL_ADDR
  )
  const BALPerToken = totalBALAmount * (1 / totalBPTAmount)
  const yourBALEarnings = BALPerToken * stakedBPTAmount

  const BALWeeklyROI = (BALPerToken * BALPrice * 100) / BPTPrice

  return {
    apr: toFixed(BALWeeklyROI * 52, 4),
  }
}
