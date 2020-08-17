import { ethers } from 'ethers'
import {
  CURVE_SUSD_POOL_ABI,
  ERC20_ABI,
  YFFI_REWARD_CONTRACT_ABI,
} from '../../../constants'
import {
  getPrices,
  get_synth_weekly_rewards,
  toDollar,
  toFixed,
} from '../../../utils'
import { priceLookupService } from '../../../price-lookup-service'

const SCRV_TOKEN_ADDR = '0xC25a3A3b969415c80451098fa907EC722572917F'
const CURVE_SUSD_POOL_ADDR = '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD'

export default async function main(App) {
  const stakingTokenAddr = SCRV_TOKEN_ADDR
  const stakingTokenTicker = 'sCRV'
  const rewardPoolAddr = '0x5BB622ba7b2F09BF23F1a9b509cd210A818c53d7'

  const REWARD_POOL = new ethers.Contract(
    rewardPoolAddr,
    YFFI_REWARD_CONTRACT_ABI,
    App.provider
  )
  const CURVE_S_POOL = new ethers.Contract(
    CURVE_SUSD_POOL_ADDR,
    CURVE_SUSD_POOL_ABI,
    App.provider
  )
  const STAKING_TOKEN = new ethers.Contract(
    stakingTokenAddr,
    ERC20_ABI,
    App.provider
  )

  const stakedYAmount = (await REWARD_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFFI = (await REWARD_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalStakedYAmount =
    (await STAKING_TOKEN.balanceOf(rewardPoolAddr)) / 1e18

  const weekly_reward = await get_synth_weekly_rewards(REWARD_POOL)

  const rewardPerToken = weekly_reward / totalStakedYAmount

  const SVirtualPrice = (await CURVE_S_POOL.get_virtual_price()) / 1e18

  const {
    'based-money': rewardTokenPrice,
  } = await priceLookupService.getPrices(['based-money'])
  const stakingTokenPrice = SVirtualPrice

  const weeklyRoi =
    (rewardPerToken * rewardTokenPrice * 100) / stakingTokenPrice

  return {
    provider: 'Based',
    name: 'sCRV',
    poolRewards: ['BASED'],
    links: [
      {
        title: 'Info',
        link: 'http://based.money/',
      },
      {
        title: 'Pool',
        link: 'https://www.curve.fi/susdv2/deposit',
      },
      {
        title: 'Staking',
        link: 'https://stake.based.money/',
      },
    ],
    apr: toFixed(weeklyRoi * 52, 4),
    prices: [
      { label: 'BASED', value: toDollar(rewardTokenPrice) },
      { label: stakingTokenTicker, value: toDollar(stakingTokenPrice) },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedYAmount * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(stakedYAmount * stakingTokenPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedYFFI, 4)} BASED`,
        value: toDollar(earnedYFFI * rewardTokenPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(weeklyRoi / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(weeklyRoi / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(weeklyRoi, 4)}%`,
      },
    ],
  }
}
