import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  ERC20_ABI,
  YFI_TOKEN_ADDR,
  YFI_YCRV_BPT_TOKEN_ADDR,
  YGOV_BPT_2_STAKING_POOL_ABI,
  YGOV_BPT_2_STAKING_POOL_ADDR,
  Y_TOKEN_ADDR,
} from '../../../constants'
import { get_synth_weekly_rewards, lookUpPrices, toFixed } from '../../../utils'

export default async function main(App) {
  const YGOV_2_BPT_POOL = new ethers.Contract(
    YGOV_BPT_2_STAKING_POOL_ADDR,
    YGOV_BPT_2_STAKING_POOL_ABI,
    App.provider
  )
  const Y_DAI_BALANCER_POOL = new ethers.Contract(
    YFI_YCRV_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const Y_DAI_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFI_YCRV_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const YFI_TOKEN_CONTRACT = new ethers.Contract(
    YFI_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount =
    (await YGOV_2_BPT_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await YGOV_2_BPT_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await Y_DAI_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await Y_DAI_BPT_TOKEN_CONTRACT.balanceOf(YGOV_BPT_2_STAKING_POOL_ADDR)) /
    1e18
  const totalYFIAmount =
    (await Y_DAI_BALANCER_POOL.getBalance(YFI_TOKEN_ADDR)) / 1e18
  const totalYAmount =
    (await Y_DAI_BALANCER_POOL.getBalance(Y_TOKEN_ADDR)) / 1e18

  const YFIPerBPT = totalYFIAmount / totalBPTAmount
  const YPerBPT = totalYAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(YGOV_2_BPT_POOL)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  const prices = await lookUpPrices(['yearn-finance'])
  const YFIPrice = prices['yearn-finance'].usd

  const BPTPrice = YFIPerBPT * YFIPrice + YPerBPT * YVirtualPrice

  const YFIWeeklyROI = (rewardPerToken * YFIPrice * 100) / BPTPrice

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
  }
}
