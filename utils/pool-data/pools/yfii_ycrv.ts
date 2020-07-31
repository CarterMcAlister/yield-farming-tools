import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFII_DAI_BPT_TOKEN_ADDR,
  YFII_STAKING_POOL_ADDR,
  YFII_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
  Y_TOKEN_ADDR,
} from '../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../utils'
const _print = console.log

export default async function main(App) {
  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...')

  const Y_STAKING_POOL = new ethers.Contract(
    YFII_STAKING_POOL_ADDR,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(Y_TOKEN_ADDR, ERC20_ABI, App.provider)
  const YFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFII_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalSupplyY = (await Y_TOKEN.totalSupply()) / 1e18
  const totalStakedYAmount =
    (await Y_TOKEN.balanceOf(YFII_STAKING_POOL_ADDR)) / 1e18

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(Y_STAKING_POOL)
  // const weekly_reward = 0;

  const rewardPerToken = weekly_reward / totalStakedYAmount

  // Find out underlying assets of Y
  const YVirtualPrice = (await CURVE_Y_POOL.get_virtual_price()) / 1e18

  _print('Finished reading smart contracts... Looking up prices... \n')

  // Look up prices
  // const prices = await lookUpPrices(["yearn-finance"]);
  // const YFIPrice = prices["yearn-finance"].usd;
  const prices = await lookUpPrices(['dai'])
  const DAIPrice = prices['dai'].usd
  const YFIIPrice =
    ((await YFI_DAI_BALANCER_POOL.getSpotPrice(
      DAI_TOKEN_ADDR,
      YFII_TOKEN_ADDR
    )) /
      1e18) *
    DAIPrice

  // Finished. Start printing

  _print('========== PRICES ==========')
  _print(`1 YFII  = $${YFIIPrice}`)
  _print(`1 yCRV  = $${YVirtualPrice}\n`)

  _print('========== STAKING =========')
  _print(`There are total   : ${totalSupplyY} yCRV issued by Y Curve Pool.`)
  _print(
    `There are total   : ${totalStakedYAmount} yCRV staked in YFII's yCRV staking pool.`
  )
  _print(
    `                  = ${toDollar(totalStakedYAmount * YVirtualPrice)}\n`
  )
  _print(
    `You are staking   : ${stakedYAmount} yCRV (${toFixed(
      (stakedYAmount * 100) / totalStakedYAmount,
      3
    )}% of the pool)`
  )
  _print(`                  = ${toDollar(stakedYAmount * YVirtualPrice)}\n`)

  // YFII REWARDS
  _print('======== YFII REWARDS ========')
  // _print(" (Temporarily paused until further emission model is voted by the community) ");
  _print(
    `Claimable Rewards : ${toFixed(earnedYFI, 4)} YFII = $${toFixed(
      earnedYFI * YFIIPrice,
      2
    )}`
  )
  _print(
    `Weekly estimate   : ${toFixed(
      rewardPerToken * stakedYAmount,
      2
    )} YFII = ${toDollar(
      rewardPerToken * stakedYAmount * YFIIPrice
    )} (out of total ${weekly_reward} YFII)`
  )
  const YFIWeeklyROI = (rewardPerToken * YFIIPrice * 100) / YVirtualPrice
  _print(`Weekly ROI in USD : ${toFixed(YFIWeeklyROI, 4)}%`)
  _print(`APY (unstable)    : ${toFixed(YFIWeeklyROI * 52, 4)}% \n`)

  // CRV REWARDS
  _print('======== CRV REWARDS ========')
  _print(`    Not distributed yet`)

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
  }
}
