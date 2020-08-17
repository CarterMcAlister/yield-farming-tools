import { ethers } from 'ethers'
import {
  BALANCER_POOL_ABI,
  DAI_TOKEN_ADDR,
  ERC20_ABI,
  YFII_BPT_STAKING_POOL_ADDR,
  YFII_DAI_BPT_TOKEN_ADDR,
  YFII_TOKEN_ADDR,
  YGOV_BPT_STAKING_POOL_ABI,
} from '../../../constants'
import { priceLookupService } from '../../../price-lookup-service'
import { get_synth_weekly_rewards, toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  const YGOV_BPT_POOL = new ethers.Contract(
    YFII_BPT_STAKING_POOL_ADDR,
    YGOV_BPT_STAKING_POOL_ABI,
    App.provider
  )
  const YFI_DAI_BALANCER_POOL = new ethers.Contract(
    YFII_DAI_BPT_TOKEN_ADDR,
    BALANCER_POOL_ABI,
    App.provider
  )
  const YFI_DAI_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFII_DAI_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const stakedBPTAmount =
    (await YGOV_BPT_POOL.balanceOf(App.YOUR_ADDRESS)) / 1e18
  const earnedYFI = (await YGOV_BPT_POOL.earned(App.YOUR_ADDRESS)) / 1e18
  const totalBPTAmount = (await YFI_DAI_BALANCER_POOL.totalSupply()) / 1e18
  const totalStakedBPTAmount =
    (await YFI_DAI_BPT_TOKEN_CONTRACT.balanceOf(YFII_BPT_STAKING_POOL_ADDR)) /
    1e18
  const totalYFIAmount =
    (await YFI_DAI_BALANCER_POOL.getBalance(YFII_TOKEN_ADDR)) / 1e18
  const totalDAIAmount =
    (await YFI_DAI_BALANCER_POOL.getBalance(DAI_TOKEN_ADDR)) / 1e18

  const YFIPerBPT = totalYFIAmount / totalBPTAmount
  const DAIPerBPT = totalDAIAmount / totalBPTAmount

  // Find out reward rate
  const weekly_reward = await get_synth_weekly_rewards(YGOV_BPT_POOL)
  const rewardPerToken = weekly_reward / totalStakedBPTAmount

  // Look up prices
  const {
    'yfii-finance': YFIIPrice,
    dai: DAIPrice,
  } = await priceLookupService.getPrices(['yfii-finance', 'dai'])

  const BPTPrice = YFIPerBPT * YFIIPrice + DAIPerBPT * DAIPrice

  const YFIWeeklyROI = (rewardPerToken * YFIIPrice * 100) / BPTPrice

  return {
    provider: 'yfii.finance',
    name: 'Balancer YFII-DAI',
    poolRewards: ['YFII', 'BAL'],
    apr: toFixed(YFIWeeklyROI * 52, 4),
    prices: [
      { label: 'YFFI', value: toDollar(YFIIPrice) },
      {
        label: 'BPT',
        value: toDollar(YFIPerBPT * YFIIPrice + DAIPerBPT * DAIPrice),
      },
    ],
    staking: [
      {
        label: 'Pool Total',
        value: toDollar(totalStakedBPTAmount * BPTPrice),
      },
      {
        label: 'Your Total',
        value: toDollar(
          YFIPerBPT * stakedBPTAmount * YFIIPrice +
            DAIPerBPT * stakedBPTAmount * DAIPrice
        ),
      },
    ],
    rewards: [
      {
        label: `${toFixed(earnedYFI, 4)} YFI`,
        value: toDollar(earnedYFI * YFIIPrice),
      },
    ],
    ROIs: [
      {
        label: 'Hourly',
        value: `${toFixed(YFIWeeklyROI / 7 / 24, 4)}%`,
      },
      {
        label: 'Daily',
        value: `${toFixed(YFIWeeklyROI / 7, 4)}%`,
      },
      {
        label: 'Weekly',
        value: `${toFixed(YFIWeeklyROI, 4)}%`,
      },
    ],
    links: [
      {
        title: 'Instructions',
        link:
          'https://yfii.s3-ap-northeast-1.amazonaws.com/YFII_Innovative_DeFi_Yield_Farming_Token.pdf',
      },
      {
        title: 'Balancer Pool',
        link:
          'https://pools.balancer.exchange/#/pool/0x16cAC1403377978644e78769Daa49d8f6B6CF565',
      },
      {
        title: 'Staking',
        link: 'https://www.yfii.finance/#/stake',
      },
      {
        title: 'Token',
        link:
          'https://etherscan.io/address/0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
      },
    ],
  }
}
