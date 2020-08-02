import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFFI_DAI_BPT_TOKEN_ADDR,
  YFFI_POOL_1_ADDR,
  YFFI_TOKEN_ADDR,
  Y_STAKING_POOL_ABI,
  Y_TOKEN_ADDR,
} from '../../../constants'
import {
  forHumans,
  getPeriodFinishForReward,
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

const _print = console.log
const _print_bold = console.log
const _print_link = console.log
const _print_href = console.log

export default async function main(App) {
  _print(`Initialized ${App.YOUR_ADDRESS}`)
  _print('Reading smart contracts...')

  const Y_STAKING_POOL = new ethers.Contract(
    YFFI_POOL_1_ADDR,
    Y_STAKING_POOL_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    CURVE_Y_POOL_ADDR,
    CURVE_Y_POOL_ABI as any,
    App.provider
  )
  const Y_TOKEN = new ethers.Contract(Y_TOKEN_ADDR, ERC20_ABI, App.provider)
  const YFFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFFI_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )

  const stakedYAmount =
    (await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI = (await Y_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalSupplyY = (await Y_TOKEN.totalSupply()) / 1e18
  const totalStakedYAmount = (await Y_TOKEN.balanceOf(YFFI_POOL_1_ADDR)) / 1e18

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(Y_STAKING_POOL)
  const nextHalving = await getPeriodFinishForReward(Y_STAKING_POOL)

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
  const YFFIPrice =
    ((await YFFI_DAI_BALANCER_POOL.getSpotPrice(
      DAI_TOKEN_ADDR,
      YFFI_TOKEN_ADDR
    )) /
      1e18) *
    DAIPrice

  // Finished. Start printing

  _print('========== PRICES ==========')
  _print(`1 YFFI  = $${YFFIPrice}`)
  _print(`1 yCRV  = $${YVirtualPrice}\n`)

  _print('========== STAKING =========')
  _print(`There are total   : ${totalSupplyY} yCRV issued by Y Curve Pool.`)
  _print(
    `There are total   : ${totalStakedYAmount} yCRV staked in YFFI's yCRV staking pool.`
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
  _print('======== YFFI REWARDS ========')
  // _print(" (Temporarily paused until further emission model is voted by the community) ");
  _print(
    `Claimable Rewards : ${toFixed(earnedYFFI, 4)} YFFI = $${toFixed(
      earnedYFFI * YFFIPrice,
      2
    )}`
  )
  const YFFIWeeklyEstimate = rewardPerToken * stakedYAmount

  _print(
    `Hourly estimate   : ${toFixed(
      YFFIWeeklyEstimate / (24 * 7),
      4
    )} YFFI = ${toDollar(
      (YFFIWeeklyEstimate / (24 * 7)) * YFFIPrice
    )} (out of total ${toFixed(weekly_reward / (7 * 24), 2)} YFFI)`
  )
  _print(
    `Daily estimate    : ${toFixed(
      YFFIWeeklyEstimate / 7,
      2
    )} YFFI = ${toDollar(
      (YFFIWeeklyEstimate / 7) * YFFIPrice
    )} (out of total ${toFixed(weekly_reward / 7, 2)} YFFI)`
  )
  _print(
    `Weekly estimate   : ${toFixed(YFFIWeeklyEstimate, 2)} YFFI = ${toDollar(
      YFFIWeeklyEstimate * YFFIPrice
    )} (out of total ${weekly_reward} YFFI)`
  )
  const YFIWeeklyROI = (rewardPerToken * YFFIPrice * 100) / YVirtualPrice

  _print(`\nHourly ROI in USD : ${toFixed(YFIWeeklyROI / 7 / 24, 4)}%`)
  _print(`Daily ROI in USD  : ${toFixed(YFIWeeklyROI / 7, 4)}%`)
  _print(`Weekly ROI in USD : ${toFixed(YFIWeeklyROI, 4)}%`)
  _print(`APY (unstable)    : ${toFixed(YFIWeeklyROI * 52, 4)}% \n`)

  const timeTilHalving = nextHalving - Date.now() / 1000

  _print(`Next halving      : in ${forHumans(timeTilHalving)} \n`)

  // CRV REWARDS
  _print('======== CRV REWARDS ========')
  _print(`    Not distributed yet`)

  return {
    apr: toFixed(YFIWeeklyROI * 52, 4),
  }
}
