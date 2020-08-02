import { ethers } from 'ethers'
import * as Constant from '../../../constants'
import {
  get_synth_weekly_rewards,
  lookUpPrices,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const CURVE_SUSD_POOL = new ethers.Contract(
    Constant.CURVE_SUSD_POOL_ADDR,
    Constant.CURVE_SUSD_POOL_ABI as any,
    App.provider
  )
  const SYNTH_crvPlain3andSUSD_POOL = new ethers.Contract(
    Constant.SYNTH_crvPlain3andSUSD_STAKING_POOL_ADDR,
    Constant.SYNTH_crvPlain3andSUSD_STAKING_POOL_ABI,
    App.provider
  )
  const crvPlain3andSUSD_TOKEN_CONTRACT = new ethers.Contract(
    Constant.crvPlain3andSUSD_TOKEN_ADDR,
    Constant.ERC20_ABI,
    App.provider
  )

  // SYNTH Staking pool
  const rawStakedCRVAmount = await SYNTH_crvPlain3andSUSD_POOL.balanceOf(
    App.YOUR_ADDRESS
  )
  const stakedCRVAmount = rawStakedCRVAmount / 1e18
  const earnedSNX =
    (await SYNTH_crvPlain3andSUSD_POOL.earned(App.YOUR_ADDRESS)) / 1e18

  // Curve susd pool
  const totalCrvPlain3andSUSDSupply =
    (await crvPlain3andSUSD_TOKEN_CONTRACT.totalSupply()) / 1e18
  const totalStakedCrvPlain3andSUSDAmount =
    (await crvPlain3andSUSD_TOKEN_CONTRACT.balanceOf(
      Constant.SYNTH_crvPlain3andSUSD_STAKING_POOL_ADDR
    )) / 1e18
  const stakingPoolPercentage =
    (100 * stakedCRVAmount) / totalStakedCrvPlain3andSUSDAmount

  const totalDaiAmount = (await CURVE_SUSD_POOL.balances(0)) / 1e18
  const totalUSDCAmount = (await CURVE_SUSD_POOL.balances(1)) / 1e6
  const totalUSDTAmount = (await CURVE_SUSD_POOL.balances(2)) / 1e6
  const totalSUSDAmount = (await CURVE_SUSD_POOL.balances(3)) / 1e18

  const DAIPerToken = totalDaiAmount / totalCrvPlain3andSUSDSupply
  const USDCPerToken = totalUSDCAmount / totalCrvPlain3andSUSDSupply
  const USDTPerToken = totalUSDTAmount / totalCrvPlain3andSUSDSupply
  const sUSDPerToken = totalSUSDAmount / totalCrvPlain3andSUSDSupply

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(
    SYNTH_crvPlain3andSUSD_POOL
  )
  const rewardPerToken = weekly_reward / totalStakedCrvPlain3andSUSDAmount

  // CoinGecko price lookup
  const prices: any = await lookUpPrices([
    'havven',
    'dai',
    'usd-coin',
    'tether',
    'nusd',
  ])

  const SNXPrice = prices.havven.usd
  const DAIPrice = prices.dai.usd
  const USDCPrice = prices['usd-coin'].usd
  const USDTPrice = prices.tether.usd
  const sUSDPrice = prices.nusd.usd

  const crvPlain3andSUSDPricePerToken = toFixed(
    DAIPerToken * DAIPrice +
      USDCPerToken * USDCPrice +
      USDTPerToken * USDTPrice +
      sUSDPerToken * sUSDPrice,
    2
  )

  const SNXWeeklyROI =
    (rewardPerToken * SNXPrice * 100) / crvPlain3andSUSDPricePerToken

  return {
    apr: toFixed(SNXWeeklyROI * 52, 4),
    prices: [
      { label: 'SNX', value: toDollar(SNXPrice) },
      { label: 'DAI', value: toDollar(DAIPrice) },
      { label: 'USDT', value: toDollar(USDTPrice) },
      { label: 'sUSD', value: toDollar(sUSDPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(
          totalStakedCrvPlain3andSUSDAmount * crvPlain3andSUSDPricePerToken
        ),
      },
      {
        label: 'Your Total',
        value: toDollar(crvPlain3andSUSDPricePerToken * stakedCRVAmount),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedSNX, 2)} SNX`,
        value: toDollar(earnedSNX * SNXPrice),
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
        link: 'https://blog.synthetix.io/new-curve-pool-launch/',
      },
      {
        title: 'Curve Pool',
        link: 'https://beta.curve.fi/susdv2/',
      },
      {
        title: 'Stake',
        link: 'https://mintr.synthetix.io',
      },
    ],
  }
}
