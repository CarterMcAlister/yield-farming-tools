import {
  ERC20_ABI,
  YFFI_REWARD_CONTRACT_ABI,
  Y_STAKING_POOL_ABI,
} from '../../constants'
import {
  getSnxBasedStakingData,
  getSnxBasedUniPoolStakingData,
  PoolData,
  TokenData,
} from '../pool-templates/snx-based'
import {
  ALINK_TOKEN,
  COMP_TOKEN,
  LEND_TOKEN,
  MKR_TOKEN,
  PASTA_TOKEN,
  SNX_TOKEN,
  WBTC_TOKEN,
  WETH_TOKEN,
  YFI_TOKEN,
  YYCRV_TOKEN,
} from '../pool-templates/token-data'

const poolData: PoolData = {
  provider: 'spaghetti.money',
  name: `PASTA`,
  added: '2020-08-18 22:50:58',
  links: [
    {
      title: 'Info',
      link:
        'https://medium.com/@SpaghettiMoney/announcing-spaghetti-money-6694beaeaf45',
    },
    {
      title: 'Staking',
      link: 'https://spaghetti.money/',
    },
  ],
}

const yfiStakingPool: TokenData = {
  address: '0x093430541975e7aa0b2D9De2085BF99F33a5e91C',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaYfiPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    YFI_TOKEN,
    PASTA_TOKEN,
    yfiStakingPool,
    poolData
  )

const compStakingPool: TokenData = {
  address: '0x31A5F7a7a12af1A317491b1285C59E63e16654A1',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaCompPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    COMP_TOKEN,
    PASTA_TOKEN,
    compStakingPool,
    poolData
  )

const lendStakingPool: TokenData = {
  address: '0xc98161569F57bE86D4D22B5b3228718F9F7101ad',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaLendPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    LEND_TOKEN,
    PASTA_TOKEN,
    lendStakingPool,
    poolData
  )

const linkStakingPool: TokenData = {
  address: '0xF774584b6d12A3F93bD7b5FC20A44549cc5e2f07',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaLinkPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    ALINK_TOKEN,
    PASTA_TOKEN,
    linkStakingPool,
    poolData
  )

const mkrStakingPool: TokenData = {
  address: '0x6a3F3e76ad1EE05f5382D79F9047eFfD8417670c',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaMkrPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    MKR_TOKEN,
    PASTA_TOKEN,
    mkrStakingPool,
    poolData
  )

const snxStakingPool: TokenData = {
  address: '0xF3a68aA38d8f54AFaAD90CD98E71e88eCc021E23',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaSnxPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    SNX_TOKEN,
    PASTA_TOKEN,
    snxStakingPool,
    poolData
  )

const wethStakingPool: TokenData = {
  address: '0x4547a86cA6a84b9D60DC57aF908472074DE7af5F',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaWethPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    WETH_TOKEN,
    PASTA_TOKEN,
    wethStakingPool,
    poolData
  )

const wbtcStakingPool: TokenData = {
  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  ABI: Y_STAKING_POOL_ABI,
}
export const pastaWbtcPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    WBTC_TOKEN,
    PASTA_TOKEN,
    wbtcStakingPool,
    poolData
  )

const uniTokenStakingPool: TokenData = {
  address: '0xe05809d3465f0bccd142208c7a3bb15bca23e13f',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const pastaYycrvPoolToken: TokenData = {
  address: '0x2df3355ed1b532486b0e48a4977afc1ca8e8a566',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
poolData.links.push({
  title: 'Pool',
  link:
    'https://app.uniswap.org/#/add/0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8/0x08A2E41FB99A7599725190B9C970Ad3893fa33CF',
})
export const pastaYcrvPool = async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    YYCRV_TOKEN,
    PASTA_TOKEN,
    pastaYycrvPoolToken,
    uniTokenStakingPool,
    poolData,
    pastaYycrvPoolToken.address
  )
