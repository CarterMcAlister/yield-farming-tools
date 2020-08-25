import {
  ERC20_ABI,
  YFFI_REWARD_CONTRACT_ABI,
  Y_STAKING_POOL_ABI,
} from '../../../data/constants'
import { getSnxBasedStakingData } from '../../pool-templates/staking'
import {
  COMP_TOKEN,
  CREAM_TOKEN,
  SHRIMP_TOKEN,
  WETH_TOKEN,
  YAM_TOKEN,
  YCRV_TOKEN,
  YFI_TOKEN,
} from '../../../data/token-data'
import { getSnxBasedUniPoolStakingData } from '../../pool-templates/uniswap-staking'
import { PoolData, TokenData } from '../../../types'

const poolData: PoolData = {
  provider: 'Shrimp',
  name: 'Shrimp',
  added: '2020-08-16 22:50:28',
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

const uniTokenStakingPool: TokenData = {
  address: '0xADDBCd6A68BFeb6E312e82B30cE1EB4a54497F4c',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const shrimpYcrvPoolToken: TokenData = {
  address: '0xeba5d22bbeb146392d032a2f74a735d66a32aee4',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
poolData.links.push({
  title: 'Pool',
  link:
    'https://app.uniswap.org/#/add/0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
})
export const shrimpYcrvPool = async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    YCRV_TOKEN,
    YAM_TOKEN,
    shrimpYcrvPoolToken,
    uniTokenStakingPool,
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
