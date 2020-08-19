import {
  getSnxBasedStakingData,
  getSnxBasedUniPoolStakingData,
  PoolData,
  TokenData,
} from '../pool-templates/snx-based'
import {
  YFI_TOKEN,
  YAM_TOKEN,
  COMP_TOKEN,
  LEND_TOKEN,
  LINK_TOKEN,
  MKR_TOKEN,
  SNX_TOKEN,
  WETH_TOKEN,
  YCRV_TOKEN,
} from '../pool-templates/token-data'
import {
  Y_STAKING_POOL_ABI,
  YAM_YCRV_UNI_TOKEN_ADDR,
  ERC20_ABI,
  YFFI_REWARD_CONTRACT_ABI,
} from '../../constants'

const poolData: PoolData = {
  provider: 'yam.finance',
  name: `Yam`,
  links: [
    {
      title: 'Info',
      link: 'https://medium.com/@yamfinance/yam-finance-d0ad577250c7',
    },
    {
      title: 'Staking',
      link: 'https://yam.finance/',
    },
  ],
}

const yfiStakingPool: TokenData = {
  address: '0xc5B6488c7D5BeD173B76Bd5DCA712f45fB9EaEaB',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamYfiPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    YFI_TOKEN,
    YAM_TOKEN,
    yfiStakingPool,
    poolData
  )

const compStakingPool: TokenData = {
  address: '0x8538E5910c6F80419CD3170c26073Ff238048c9E',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamCompPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    COMP_TOKEN,
    YAM_TOKEN,
    compStakingPool,
    poolData
  )

const lendStakingPool: TokenData = {
  address: '0x6009A344C7F993B16EBa2c673fefd2e07f9be5FD',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamLendPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    LEND_TOKEN,
    YAM_TOKEN,
    lendStakingPool,
    poolData
  )

const linkStakingPool: TokenData = {
  address: '0xFDC28897A1E32B595f1f4f1D3aE0Df93B1eee452',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamLinkPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    LINK_TOKEN,
    YAM_TOKEN,
    linkStakingPool,
    poolData
  )

const mkrStakingPool: TokenData = {
  address: '0xcFe1E539AcB2D489a651cA011a6eB93d32f97E23',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamMkrPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    MKR_TOKEN,
    YAM_TOKEN,
    mkrStakingPool,
    poolData
  )

const snxStakingPool: TokenData = {
  address: '0x6c3FC1FFDb14D92394f40eeC91D9Ce8B807f132D',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamSnxPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    SNX_TOKEN,
    YAM_TOKEN,
    snxStakingPool,
    poolData
  )

const wethStakingPool: TokenData = {
  address: '0x587A07cE5c265A38Dd6d42def1566BA73eeb06F5',
  ABI: Y_STAKING_POOL_ABI,
}
export const yamWethPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    WETH_TOKEN,
    YAM_TOKEN,
    wethStakingPool,
    poolData
  )

const uniTokenStakingPool: TokenData = {
  address: '0xADDBCd6A68BFeb6E312e82B30cE1EB4a54497F4c',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const yamYcrvPoolToken: TokenData = {
  address: YAM_YCRV_UNI_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
poolData.links.push({
  title: 'Pool',
  link:
    'https://app.uniswap.org/#/add/0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
})
export const yamYcrvPool = async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    YCRV_TOKEN,
    YAM_TOKEN,
    yamYcrvPoolToken,
    uniTokenStakingPool,
    poolData
  )
