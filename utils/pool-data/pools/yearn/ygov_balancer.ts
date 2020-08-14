import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFI_DAI_BPT_TOKEN_ADDR,
  YFI_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
  YGOV_BPT_STAKING_POOL_ADDR,
} from '../../../constants'
import { get_synth_weekly_rewards, lookUpPrices, toFixed } from '../../../utils'

export default async function main(App) {
  const YGOV_BPT_POOL = new ethers.Contract(
    YGOV_BPT_STAKING_POOL_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFI_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFI_DAI_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFI_DAI_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount =
    (await YGOV_BPT_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await YGOV_BPT_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFI_DAI_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFI_DAI_BPT_TOKEN_CONTRACT.balanceOf(YGOV_BPT_STAKING_POOL_ADDR)) /
    1e18
  const totalYFIAmount =
    (await YFI_DAI_BALANCER_POOL.getBalance(YFI_TOKEN_ADDR)) / 1e18
  const totalDAIAmount =
    (await YFI_DAI_BALANCER_POOL.getBalance(DAI_TOKEN_ADDR)) / 1e18

  const YFIPerBPT = totalYFIAmount / totalBPTAmount
  const DAIPerBPT = totalDAIAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(YGOV_BPT_POOL)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  // Look up prices
  const prices = await lookUpPrices(['yearn-finance', 'dai'])
  const YFIPrice = prices['yearn-finance'].usd
  const DAIPrice = prices['dai'].usd

  const BPTPrice = YFIPerBPT * YFIPrice + DAIPerBPT * DAIPrice

  const YFIWeeklyROI = (rewardPerToken * YFIPrice * 100) / BPTPrice

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
  }
}
