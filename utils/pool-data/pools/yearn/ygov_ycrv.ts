import { ethers } from 'ethers'
import {
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  ERC20_ABI,
  Y_STAKING_POOL_ABI,
  Y_STAKING_POOL_ADDR,
  Y_TOKEN_ADDR,
} from '../../../constants'
import { lookUpPrices, toFixed } from '../../../utils'

export default async function main(App) {
  const Y_STAKING_POOL = new ethers.Contract(
    Y_STAKING_POOL_ADDR,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(Y_TOKEN_ADDR, ERC20_ABI, App.provider)

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalSupplyY = (await Y_TOKEN.totalSupply()) / 1e18
  const totalStakedYAmount =
    (await Y_TOKEN.balanceOf(Y_STAKING_POOL_ADDR)) / 1e18

  // Find out reward rate
  // const weekly_reward = await get_synth_weekly_rewards(Y_STAKING_POOL);
  const weekly_reward = 0

  const rewardPerToken = weekly_reward / totalStakedYAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  // Look up prices
  const prices = await lookUpPrices(['yearn-finance'])
  const YFIPrice = prices['yearn-finance'].usd

  const YFIWeeklyROI = (rewardPerToken * YFIPrice * 100) / YVirtualPrice

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
  }
}
