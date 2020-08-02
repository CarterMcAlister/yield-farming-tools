import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  ERC20_ABI,
  MUSD_TOKEN_ADDR,
  MUSD_USDC_BPT_TOKEN_ADDR,
  USDC_ADDRESS,
} from '../../../constants'
import { lookUpPrices, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const MUSD_USDC_BALANCER_POOL = new ethers.Contract(
    MUSD_USDC_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const MUSD_USDC_BPT_TOKEN_CONTRACT = new ethers.Contract(
    MUSD_USDC_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const totalBPTAmount = (await MUSD_USDC_BALANCER_POOL.totalSupply()) / 1e18
  const yourBPTAmount =
    (await MUSD_USDC_BPT_TOKEN_CONTRACT.balanceOf(App.YOUR_ADDRESS)) / 1e18

  const totalUSDCAmount =
    (await MUSD_USDC_BALANCER_POOL.getBalance(USDC_ADDRESS)) / 1e6
  const totalMUSDAmount =
    (await MUSD_USDC_BALANCER_POOL.getBalance(MUSD_TOKEN_ADDR)) / 1e18

  const USDCPerBPT = totalUSDCAmount / totalBPTAmount
  const MUSDPerBPT = totalMUSDAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = 50000
  const MTARewardPerBPT = weekly_reward / totalBPTAmount

  // Look up prices
  const prices = await lookUpPrices(['musd', 'meta', 'usd-coin'])
  const MTAPrice = prices['meta'].usd
  const MUSDPrice = prices['musd'].usd
  const USDCPrice = prices['usd-coin'].usd

  const BPTPrice = USDCPerBPT * USDCPrice + MUSDPerBPT * MUSDPrice

  // Finished. Start printing

  const WeeklyROI = (MTARewardPerBPT * MTAPrice * 100) / BPTPrice

  return {
    apr: toFixed(WeeklyROI * 52, 4),
    prices: [
      { label: 'MTA', value: toDollar(MTAPrice) },
      { label: 'mUSD', value: toDollar(MUSDPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourBPTAmount * BPTPrice),
      },
    ],
    rewards: [],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(WeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(WeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(WeeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Info',
        link: 'https://medium.com/mstable/a-recap-of-mta-rewards-9729356a66dd',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0x72Cd8f4504941Bf8c5a21d1Fd83A96499FD71d2C',
      },
    ],
  }
}
