import { ethers } from 'ethers'
import { ERC20_ABI } from '../../../constants'
import {
  getPrices,
  get_synth_weekly_rewards,
  toDollar,
  toFixed,
} from '../../../utils'

export default async function main(App) {
  const stakingTokenAddr = ''
  const stakingTokenTicker = 'sCRV'
  const rewardPoolAddr = '0x5BB622ba7b2F09BF23F1a9b509cd210A818c53d7'

  return {
    provider: '',
    name: '',
    poolRewards: [''],
    links: [
      {
        title: 'Info',
        link: '',
      },
      {
        title: 'Pool',
        link: '',
      },
      {
        title: 'Staking',
        link: '',
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
        value: toDollar(totalAmount * stakingTokenPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(yourAmount * stakingTokenPrice),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedTokens, 4)} BASED`,
        value: toDollar(earnedTokens * rewardTokenPrice),
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
