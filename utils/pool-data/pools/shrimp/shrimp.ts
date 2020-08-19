import {
  getSnxBasedStakingData,
  PoolData,
  TokenData,
} from '../../pool-templates/snx-based'
import {
  YFI_TOKEN,
  YAM_TOKEN,
  COMP_TOKEN,
  LEND_TOKEN,
  LINK_TOKEN,
  MKR_TOKEN,
  SNX_TOKEN,
  WETH_TOKEN,
  SHRIMP_TOKEN,
  CREAM_TOKEN,
} from '../../pool-templates/token-data'
import { Y_STAKING_POOL_ABI } from '../../../constants'

const poolData: PoolData = {
  provider: 'Shrimp',
  name: 'Shrimp',
  links: [
    {
      title: 'Info',
      link: 'https://twitter.com/FinanceShrimp',
    },
    {
      title: 'Staking',
      link: 'https://shrimp.finance/',
    },
  ],
}

const compStakingPool: TokenData = {
  address: '0xadceEB763dbd6F9bA7eFb7564AF2518a7fB49e7b',
  ABI: Y_STAKING_POOL_ABI,
}
export const compPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    COMP_TOKEN,
    SHRIMP_TOKEN,
    compStakingPool,
    poolData
  )

const creamStakingPool: TokenData = {
  address: '0xa8ed29d39Ec961Ded44451D38e56B609Fe08126e',
  ABI: Y_STAKING_POOL_ABI,
}
export const creamPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    CREAM_TOKEN,
    SHRIMP_TOKEN,
    creamStakingPool,
    poolData
  )

const wethStakingPool: TokenData = {
  address: '0x7127EE43FAFba873ce985683AB79dF2ce2912198',
  ABI: Y_STAKING_POOL_ABI,
}
export const wethPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    WETH_TOKEN,
    SHRIMP_TOKEN,
    wethStakingPool,
    poolData
  )

const yfiStakingPool: TokenData = {
  address: '0x9f83883FD3cadB7d2A83a1De51F9Bf483438122e',
  ABI: Y_STAKING_POOL_ABI,
}
export const yfiPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    YFI_TOKEN,
    SHRIMP_TOKEN,
    yfiStakingPool,
    poolData
  )

//   const diceStakingPool: TokenData = {
//     address: '0x9f83883FD3cadB7d2A83a1De51F9Bf483438122e',
//     ABI: Y_STAKING_POOL_ABI,
//   }
//   export const dicePool = async (App) =>
//     await getSnxBasedStakingData(
//       App,
//       DICE_TOKEN,
//       SHRIMP_TOKEN,
//       creamStakingPool,
//       poolData
//     )
