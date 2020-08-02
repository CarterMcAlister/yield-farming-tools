import { ethers } from 'ethers'
import * as Constant from '../../../constants'
import {
  getLatestTotalBALAmount,
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const CURVE_BTC_POOL = new ethers.Contract(
    Constant.CURVE_BTC_POOL_ADDR,
    Constant.CURVE_BTC_POOL_ABI as any,
    App.provider
  )
  const SYNTH_CRV_POOL = new ethers.Contract(
    Constant.SYNTH_crvRenWSBTC_STAKING_POOL_ADDR,
    Constant.SYNTH_crvRenWSBTC_STAKING_POOL_ABI,
    App.provider
  )
  const BALANCER_SNX_REN_POOL = new ethers.Contract(
    Constant.BALANCER_SNX_REN_POOL_ADDR,
    Constant.BALANCER_SNX_REN_POOL_ABI,
    App.provider
  )
  const BPT_POOL = new ethers.Contract(
    Constant.BPT_SNX_REN_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )
  const crvRenWSBTC_TOKEN_CONTRACT = new ethers.Contract(
    Constant.crvRenWSBTC_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )

  // Curve
  const rawStakedCRVAmount = await SYNTH_CRV_POOL.balanceOf(App.YOUR_ADDRESS)
  const stakedCRVAmount = rawStakedCRVAmount / 1e18

  const totalRenBTCAmount = (await CURVE_BTC_POOL.balances(0)) / 1e8
  const totalWBTCAmount = (await CURVE_BTC_POOL.balances(1)) / 1e8
  const totalSBTCAmount = (await CURVE_BTC_POOL.balances(2)) / 1e18
  const totalCrvRenWSBTCSupply =
    (await crvRenWSBTC_TOKEN_CONTRACT.totalSupply()) / 1e18

  const renBTCamountPerToken = totalRenBTCAmount * (1 / totalCrvRenWSBTCSupply)
  const wBTCamountPerToken = totalWBTCAmount * (1 / totalCrvRenWSBTCSupply)
  const sBTCamountPerToken = totalSBTCAmount * (1 / totalCrvRenWSBTCSupply)

  // Balancer
  const earnedBPT = (await SYNTH_CRV_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await BALANCER_SNX_REN_POOL.totalSupply()) / 1e18
  const totalSNXAmount =
    (await BALANCER_SNX_REN_POOL.getBalance(Constant.SNX_TOKEN_ADDRESS)) / 1e18
  const totalBPTInSynthContract =
    (await BPT_POOL.balanceOf(Constant.SYNTH_crvRenWSBTC_STAKING_POOL_ADDR)) /
    1e18

  const totalStakedCrvRenWSBTCAmount =
    (await crvRenWSBTC_TOKEN_CONTRACT.balanceOf(
      Constant.SYNTH_crvRenWSBTC_STAKING_POOL_ADDR
    )) / 1e18
  const totalRENAmount =
    (await BALANCER_SNX_REN_POOL.getBalance(Constant.REN_ADDRESS)) / 1e18

  const SNXperBPT = totalSNXAmount / totalBPTAmount
  const RENperBPT = totalRENAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(SYNTH_CRV_POOL)
  const rewardPerToken = weekly_reward / totalStakedCrvRenWSBTCAmount

  // CoinGecko price lookup
  const prices = await lookUpPrices([
    'havven',
    'republic-protocol',
    'wrapped-bitcoin',
    'sbtc',
    'renbtc',
    'balancer',
  ])

  const SNXprice = prices.havven.usd
  const RENprice = prices['republic-protocol'].usd
  const BPTPrice = SNXperBPT * SNXprice + RENperBPT * RENprice

  const renBTCPrice = prices.renbtc.usd
  const wBTCPrice = prices['wrapped-bitcoin'].usd
  const SBTCPrice = prices.sbtc.usd
  const crvRenWSBTCPricePerToken = toFixed(
    renBTCamountPerToken * renBTCPrice +
      wBTCamountPerToken * wBTCPrice +
      sBTCamountPerToken * SBTCPrice,
    2
  )

  const BALPrice = prices.balancer.usd

  const SNXWeeklyROI =
    (rewardPerToken * BPTPrice * 100) / crvRenWSBTCPricePerToken

  const totalBALAmount = await getLatestTotalBALAmount(
    Constant.SYNTH_crvRenWSBTC_STAKING_POOL_ADDR
  )
  const BALPerToken = totalBALAmount * (1 / totalBPTInSynthContract)
  const yourBALEarnings = BALPerToken * rewardPerToken * stakedCRVAmount
  const crvRenWSBTCPerDollar = 1 / crvRenWSBTCPricePerToken

  const BALWeeklyROI =
    BALPerToken * BALPrice * 100 * (rewardPerToken * crvRenWSBTCPerDollar)

  return {
    apr: toFixed(BALWeeklyROI * 52 + SNXWeeklyROI * 52, 4),
    prices: [
      { label: 'SNX', value: toDollar(SNXprice) },
      { label: 'REN', value: toDollar(RENprice) },
      { label: 'renBTC', value: toDollar(renBTCPrice) },
      { label: 'wBTC', value: toDollar(wBTCPrice) },
      { label: 'sBTC', value: toDollar(SBTCPrice) },
      { label: 'BPT', value: toDollar(BPTPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(
          totalStakedCrvRenWSBTCAmount * crvRenWSBTCPricePerToken
        ),
      },
      {
        label: 'Your Total',
        value: toDollar(crvRenWSBTCPricePerToken * stakedCRVAmount),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedBPT * SNXperBPT, 2)} SNX`,
        value: toDollar(earnedBPT * SNXperBPT * SNXprice),
      },
      {
        label: `${toFixed(earnedBPT * RENperBPT, 2)} REN`,
        value: toDollar(earnedBPT * RENperBPT * RENprice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(SNXWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(SNXWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(SNXWeeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Info',
        link: 'https://blog.synthetix.io/btc-yield-farming-pool/',
      },
      {
        title: 'Curve Pool',
        link: 'https://www.curve.fi/sbtc/deposit',
      },
      {
        title: 'Stake',
        link: 'https://mintr.synthetix.io/',
      },
      {
        title: 'Unwrap',
        link:
          'https://pools.balancer.exchange/#/pool/0x330416C863f2acCE7aF9C9314B422d24c672534a',
      },
    ],
  }
}
