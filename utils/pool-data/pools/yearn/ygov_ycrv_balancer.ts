import { ethers } from 'ethers'
import * as Constant from '../../../constants'
import {
  forHumans,
  getBlockTime,
  get_synth_weekly_rewards,
  lookUpPrices,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const YGOV_2_BPT_POOL = new ethers.Contract(
    Constant.YGOV_BPT_2_STAKING_POOL_ADDR,
    Constant.YGOV_BPT_2_STAKING_POOL_ABI,
    App.provider
  )
  const YFI_YCRV_BALANCER_POOL = new ethers.Contract(
    Constant.YFI_YCRV_BPT_TOKEN_ADDR,
    Constant.BALANCER_POOL_ABI,
    App.provider
  )
  const YFI_YCRV_BPT_TOKEN_CONTRACT = new ethers.Contract(
    Constant.YFI_YCRV_BPT_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )
  const CURVE_Y_POOL = new ethers.Contract(
    Constant.CURVE_Y_POOL_ADDR,
    Constant.CURVE_Y_POOL_ABI as any, //todo
    App.provider
  )
  const YFI_TOKEN_CONTRACT = new ethers.Contract(
    Constant.YFI_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )
  const YFI_TOKEN_STAKING_POOL = new ethers.Contract(
    Constant.YFI_STAKING_POOL_ADDR,
    Constant.YFI_STAKING_POOL_ABI,
    App.provider
  )
  const Y_TOKEN_CONTRACT = new ethers.Contract(
    Constant.Y_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount =
    (await YGOV_2_BPT_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI_raw = await YGOV_2_BPT_POOL.earned(App.YOUR_ADDRESS)

  const earnedYFI = earnedYFI_raw / 1e18
  const totalBPTAmount = (await YFI_YCRV_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFI_YCRV_BPT_TOKEN_CONTRACT.balanceOf(
      Constant.YGOV_BPT_2_STAKING_POOL_ADDR
    )) / 1e18
  const totalYFIAmount =
    (await YFI_YCRV_BALANCER_POOL.getBalance(Constant.YFI_TOKEN_ADDR)) / 1e18
  const totalYAmount =
    (await YFI_YCRV_BALANCER_POOL.getBalance(Constant.Y_TOKEN_ADDR)) / 1e18
  const voteLockBlock = await YGOV_2_BPT_POOL.voteLock(App.YOUR_ADDRESS)
  const currentBlock = await App.provider.getBlockNumber()
  const currentBlockTime: any = await getBlockTime()

  const isBPTLocked = voteLockBlock > currentBlock

  let BPTLockedMessage = 'NO'
  if (isBPTLocked) {
    let timeUntilFree = forHumans(
      (voteLockBlock - currentBlock) * currentBlockTime
    )
    BPTLockedMessage = 'YES - locked for approx. ' + timeUntilFree
  }

  // ycrv rewards
  const stakedYFIAmount =
    (await YFI_TOKEN_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const totalStakedYFIAmount =
    (await YFI_TOKEN_CONTRACT.balanceOf(Constant.YFI_STAKING_POOL_ADDR)) / 1e18
  const earnedYCRV =
    (await YFI_TOKEN_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const weekly_yCRV_reward = await get_synth_weekly_rewards(
    YFI_TOKEN_STAKING_POOL
  )
  const yCRVRewardPerToken = weekly_yCRV_reward / totalStakedYFIAmount

  const YFIPerBPT = totalYFIAmount / totalBPTAmount
  const YPerBPT = totalYAmount / totalBPTAmount

  const currentYFI = await YFI_TOKEN_CONTRACT.balanceOf(App.YOUR_ADDRESS)

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

  const YCRVWeeklyROI = (yCRVRewardPerToken * YVirtualPrice * 100) / YFIPrice

  const approveYFIAndStake = async function () {
    const signer = App.provider.getSigner()

    const YFI_TOKEN_CONTRACT = new ethers.Contract(
      Constant.YFI_TOKEN_ADDR,
      Constant.YFI_TOKEN_ABI,
      signer
    )
    const YFI_TOKEN_STAKING_POOL = new ethers.Contract(
      Constant.YFI_STAKING_POOL_ADDR,
      Constant.YFI_STAKING_POOL_ABI,
      signer
    )

    const currentYFI = await YFI_TOKEN_CONTRACT.balanceOf(App.YOUR_ADDRESS)
    const allowedYFI = await YFI_TOKEN_CONTRACT.allowance(
      App.YOUR_ADDRESS,
      Constant.YFI_STAKING_POOL_ADDR
    )

    let allow = Promise.resolve()

    if (allowedYFI < currentYFI) {
      allow = YFI_TOKEN_CONTRACT.increaseAllowance(
        Constant.YFI_STAKING_POOL_ADDR,
        currentYFI.sub(allowedYFI),
        { gasLimit: 50000 }
      ).then(function (t) {
        return App.provider.waitForTransaction(t.hash)
      })
    }

    if (currentYFI > 0) {
      allow.then(function () {
        YFI_TOKEN_STAKING_POOL.stake(currentYFI)
      })
    } else {
      alert('You have no YFI!!')
    }
  }

  const claimYFI = async function () {
    const signer = App.provider.getSigner()

    const YGOV_2_BPT_POOL2 = new ethers.Contract(
      Constant.YGOV_BPT_2_STAKING_POOL_ADDR,
      Constant.YGOV_BPT_2_STAKING_POOL_ABI,
      signer
    )
    return YGOV_2_BPT_POOL2.getReward({ gasLimit: 177298 }).then(function (t) {
      return App.provider.waitForTransaction(t.hash)
    })
  }

  const claimYFIAndStake = async function () {
    claimYFI().then(function () {
      approveYFIAndStake()
    })
  }

  return {
    apr: toFixed(YFIWeeklyROI * 52 + YCRVWeeklyROI * 52, 4),
  }
}
