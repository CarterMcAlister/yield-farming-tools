import { ethers } from 'ethers'
import {
  ERC20_ABI,
  SETH_TOKEN_ADDR,
  SYNTH_UNIV1_SETH_STAKING_POOL_ABI,
  SYNTH_UNIV1_SETH_STAKING_POOL_ADDR,
  UNISWAP_SETH_ETH_POOL_ABI,
  UNISWAP_SETH_ETH_POOL_ADDR,
} from '../../../constants'
import { get_synth_weekly_rewards, lookUpPrices, toFixed } from '../../../utils'

export default async function main(App) {
  const SYNTH_UNIV1_SETH_STAKING_POOL = new ethers.Contract(
    SYNTH_UNIV1_SETH_STAKING_POOL_ADDR,
    SYNTH_UNIV1_SETH_STAKING_POOL_ABI,
    App.provider
  )
  const UNISWAPV1_SETH_ETH_POOL = new ethers.Contract(
    UNISWAP_SETH_ETH_POOL_ADDR,
    UNISWAP_SETH_ETH_POOL_ABI as any,
    App.provider
  )
  const SETH_CONTRACT = new ethers.Contract(
    SETH_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  // SYNTH Staking Pool
  const yourStakedUniv1Amount =
    (await SYNTH_UNIV1_SETH_STAKING_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedSNX =
    (await SYNTH_UNIV1_SETH_STAKING_POOL.earned(App.YOUR_ADDRESS)) / 1e18

  // Uniswap V1 sETH-ETH Pool
  const totalUniv1SethEthTokenSupply =
    (await UNISWAPV1_SETH_ETH_POOL.totalSupply()) / 1e18
  const totalStakedUniv1SethEthTokenAmount =
    (await UNISWAPV1_SETH_ETH_POOL.balanceOf(
      SYNTH_UNIV1_SETH_STAKING_POOL_ADDR
    )) / 1e18
  const stakingPoolPercentage =
    (100 * yourStakedUniv1Amount) / totalStakedUniv1SethEthTokenAmount

  const totalSETHAmount =
    (await SETH_CONTRACT.balanceOf(UNISWAP_SETH_ETH_POOL_ADDR)) / 1e18
  const totalETHAmount =
    (await App.provider.getBalance(UNISWAP_SETH_ETH_POOL_ADDR)) / 1e18

  const sETHPerToken = totalSETHAmount / totalUniv1SethEthTokenSupply
  const ETHPerToken = totalETHAmount / totalUniv1SethEthTokenSupply

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(
    SYNTH_UNIV1_SETH_STAKING_POOL
  )
  const rewardPerToken = weekly_reward / totalStakedUniv1SethEthTokenAmount

  // CoinGecko price lookup
  const prices = await lookUpPrices(['havven', 'ethereum', 'seth'])

  const SNXPrice = prices.havven.usd
  const ETHPrice = prices.ethereum.usd
  const sETHPrice = prices.seth.usd

  const Univ1SethEthPricePerToken = toFixed(
    ETHPerToken * ETHPrice + sETHPerToken * sETHPrice,
    2
  )

  const SNXWeeklyROI =
    (rewardPerToken * SNXPrice * 100) / Univ1SethEthPricePerToken
  return {
    apr: toFixed(SNXWeeklyROI * 52, 4),
  }
}
