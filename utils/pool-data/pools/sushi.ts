import { ERC20_ABI, MASTER_CHEF_ABI } from '../../../data/constants'
import { PoolData, RiskLevel, TokenData } from '../../../types'
import { getSushiPoolData } from '../../pool-templates/sushi-based'
import {
  AMPL_TOKEN,
  BAND_TOKEN,
  COMP_TOKEN,
  DAI_TOKEN,
  LEND_TOKEN,
  LINK_TOKEN,
  SNX_TOKEN,
  SUSD_TOKEN,
  SUSHI_TOKEN,
  TETHER_TOKEN,
  UMA_TOKEN,
  USDC_TOKEN,
  WETH_TOKEN,
  YFI_TOKEN,
  SERUM_TOKEN,
  YAMV2_TOKEN,
  REN_TOKEN,
  CRV_TOKEN,
} from '../../../data/token-data'

const poolData: PoolData = {
  provider: 'Sushi',
  name: 'Uni',
  added: '2020-08-28 22:50:58',
  risk: {
    smartContract: RiskLevel.LOW,
    impermanentLoss: RiskLevel.HIGH,
  },
  links: [
    {
      title: 'Info',
      link: 'https://medium.com/sushiswap/the-sushiswap-project-c4049ea9941e',
    },
    {
      title: 'Staking',
      link: 'https://sushiswap.org/',
    },
  ],
}

const masterChefStakingPool: TokenData = {
  address: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
  ABI: MASTER_CHEF_ABI,
}

// UMA-ETH
const ethUmaPoolId = 7
const ethUmaPoolToken: TokenData = {
  address: '0x88D97d199b9ED37C29D846d00D443De980832a22',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethUmaPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x88d97d199b9ed37c29d846d00d443de980832a22',
    },
  ],
})

export const umaEthPool = async (App) =>
  await getSushiPoolData(
    App,
    UMA_TOKEN,
    SUSHI_TOKEN,
    ethUmaPoolToken,
    masterChefStakingPool,
    ethUmaPoolData,
    WETH_TOKEN,
    ethUmaPoolId
  )

//BAND-ETH
const ethBandPoolId = 9
const ethBandPoolToken: TokenData = {
  address: '0xf421c3f2e695C2D4C0765379cCace8adE4a480D9',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethBandPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xf421c3f2e695c2d4c0765379ccace8ade4a480d9',
    },
  ],
})

export const bandEthPool = async (App) =>
  await getSushiPoolData(
    App,
    BAND_TOKEN,
    SUSHI_TOKEN,
    ethBandPoolToken,
    masterChefStakingPool,
    ethBandPoolData,
    WETH_TOKEN,
    ethBandPoolId
  )

//SNX-ETH
const ethSnxPoolId = 6
const ethSnxPoolToken: TokenData = {
  address: '0x43AE24960e5534731Fc831386c07755A2dc33D47',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethSnxPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x43ae24960e5534731fc831386c07755a2dc33d47',
    },
  ],
})

export const snxEthPool = async (App) =>
  await getSushiPoolData(
    App,
    SNX_TOKEN,
    SUSHI_TOKEN,
    ethSnxPoolToken,
    masterChefStakingPool,
    ethSnxPoolData,
    WETH_TOKEN,
    ethSnxPoolId
  )

//SUSHI-ETH
const ethSushiPoolId = 12
const ethSushiPoolToken: TokenData = {
  address: '0xCE84867c3c02B05dc570d0135103d3fB9CC19433',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethSushiPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xce84867c3c02b05dc570d0135103d3fb9cc19433',
    },
  ],
})

export const sushiEthPool = async (App) =>
  await getSushiPoolData(
    App,
    SUSHI_TOKEN,
    SUSHI_TOKEN,
    ethSushiPoolToken,
    masterChefStakingPool,
    ethSushiPoolData,
    WETH_TOKEN,
    ethSushiPoolId
  )

//LEND-ETH
const ethLendPoolId = 5
const ethLendPoolToken: TokenData = {
  address: '0xaB3F9bF1D81ddb224a2014e98B238638824bCf20',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethLendPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xab3f9bf1d81ddb224a2014e98b238638824bcf20',
    },
  ],
})

export const lendEthPool = async (App) =>
  await getSushiPoolData(
    App,
    LEND_TOKEN,
    SUSHI_TOKEN,
    ethLendPoolToken,
    masterChefStakingPool,
    ethLendPoolData,
    WETH_TOKEN,
    ethLendPoolId
  )

//YFI-ETH
const ethYfiPoolId = 11
const ethYfiPoolToken: TokenData = {
  address: '0x2fDbAdf3C4D5A8666Bc06645B8358ab803996E28',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethYfiPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x2fdbadf3c4d5a8666bc06645b8358ab803996e28',
    },
  ],
})

export const yfiEthPool = async (App) =>
  await getSushiPoolData(
    App,
    YFI_TOKEN,
    SUSHI_TOKEN,
    ethYfiPoolToken,
    masterChefStakingPool,
    ethYfiPoolData,
    WETH_TOKEN,
    ethYfiPoolId
  )

//TETHER-ETH
const ethTetherPoolId = 0
const ethTetherPoolToken: TokenData = {
  address: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethTetherPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    },
  ],
})

export const tetherEthPool = async (App) =>
  await getSushiPoolData(
    App,
    TETHER_TOKEN,
    SUSHI_TOKEN,
    ethTetherPoolToken,
    masterChefStakingPool,
    ethTetherPoolData,
    WETH_TOKEN,
    ethTetherPoolId
  )

//AMPL-ETH
const ethAmplPoolId = 10
const ethAmplPoolToken: TokenData = {
  address: '0xc5be99A02C6857f9Eac67BbCE58DF5572498F40c',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethAmplPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xc5be99a02c6857f9eac67bbce58df5572498f40c',
    },
  ],
})

export const amplEthPool = async (App) =>
  await getSushiPoolData(
    App,
    AMPL_TOKEN,
    SUSHI_TOKEN,
    ethAmplPoolToken,
    masterChefStakingPool,
    ethAmplPoolData,
    WETH_TOKEN,
    ethAmplPoolId
  )

//DAI-ETH
const ethDaiPoolId = 2
const ethDaiPoolToken: TokenData = {
  address: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethDaiPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
    },
  ],
})

export const daiEthPool = async (App) =>
  await getSushiPoolData(
    App,
    DAI_TOKEN,
    SUSHI_TOKEN,
    ethDaiPoolToken,
    masterChefStakingPool,
    ethDaiPoolData,
    WETH_TOKEN,
    ethDaiPoolId
  )

//USDC-ETH
const ethUsdcPoolId = 1
const ethUsdcPoolToken: TokenData = {
  address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethUsdcPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    },
  ],
})

export const usdcEthPool = async (App) =>
  await getSushiPoolData(
    App,
    USDC_TOKEN,
    SUSHI_TOKEN,
    ethUsdcPoolToken,
    masterChefStakingPool,
    ethUsdcPoolData,
    WETH_TOKEN,
    ethUsdcPoolId
  )

//LINK-ETH
const ethLinkPoolId = 8
const ethLinkPoolToken: TokenData = {
  address: '0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethLinkPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974',
    },
  ],
})

export const linkEthPool = async (App) =>
  await getSushiPoolData(
    App,
    LINK_TOKEN,
    SUSHI_TOKEN,
    ethLinkPoolToken,
    masterChefStakingPool,
    ethLinkPoolData,
    WETH_TOKEN,
    ethLinkPoolId
  )

//COMP-ETH
const ethCompPoolId = 4
const ethCompPoolToken: TokenData = {
  address: '0xCFfDdeD873554F362Ac02f8Fb1f02E5ada10516f',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethCompPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xcffdded873554f362ac02f8fb1f02e5ada10516f',
    },
  ],
})

export const compEthPool = async (App) =>
  await getSushiPoolData(
    App,
    COMP_TOKEN,
    SUSHI_TOKEN,
    ethCompPoolToken,
    masterChefStakingPool,
    ethCompPoolData,
    WETH_TOKEN,
    ethCompPoolId
  )

//SUSD-ETH
const ethSusdPoolId = 3
const ethSusdPoolToken: TokenData = {
  address: '0xf80758aB42C3B07dA84053Fd88804bCB6BAA4b5c',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethSusdPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xf80758ab42c3b07da84053fd88804bcb6baa4b5c',
    },
  ],
})

export const susdEthPool = async (App) =>
  await getSushiPoolData(
    App,
    SUSD_TOKEN,
    SUSHI_TOKEN,
    ethSusdPoolToken,
    masterChefStakingPool,
    ethSusdPoolData,
    WETH_TOKEN,
    ethSusdPoolId
  )

//SRM-ETH
const serumEthPoolId = 15
const serumEthPoolToken: TokenData = {
  address: '0xCc3d1EceF1F9fD25599dbeA2755019DC09db3c54',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const serumEthPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xCc3d1EceF1F9fD25599dbeA2755019DC09db3c54',
    },
  ],
})

export const serumEthPool = async (App) =>
  await getSushiPoolData(
    App,
    SERUM_TOKEN,
    SUSHI_TOKEN,
    serumEthPoolToken,
    masterChefStakingPool,
    serumEthPoolData,
    WETH_TOKEN,
    serumEthPoolId
  )

// YAMv2-ETH
const yamv2EthPoolId = 16
const yamv2EthPoolToken: TokenData = {
  address: '0xA5904961f61baE7c4dD8478077556c91BF291cFD',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const yamv2EthPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xA5904961f61baE7c4dD8478077556c91BF291cFD',
    },
  ],
})

export const yamv2EthPool = async (App) =>
  await getSushiPoolData(
    App,
    YAMV2_TOKEN,
    SUSHI_TOKEN,
    yamv2EthPoolToken,
    masterChefStakingPool,
    yamv2EthPoolData,
    WETH_TOKEN,
    yamv2EthPoolId
  )

//REN-ETH
const renEthPoolId = 13
const renEthPoolToken: TokenData = {
  address: '0x8Bd1661Da98EBDd3BD080F0bE4e6d9bE8cE9858c',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const renEthPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x8Bd1661Da98EBDd3BD080F0bE4e6d9bE8cE9858c',
    },
  ],
})

export const renEthPool = async (App) =>
  await getSushiPoolData(
    App,
    REN_TOKEN,
    SUSHI_TOKEN,
    renEthPoolToken,
    masterChefStakingPool,
    renEthPoolData,
    WETH_TOKEN,
    renEthPoolId
  )

//CRV-ETH
const crvEthPoolId = 17
const crvEthPoolToken: TokenData = {
  address: '0x3dA1313aE46132A397D90d95B1424A9A7e3e0fCE',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const crvEthPoolData = Object.assign({}, poolData, {
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0x3dA1313aE46132A397D90d95B1424A9A7e3e0fCE',
    },
  ],
})

export const crvEthPool = async (App) =>
  await getSushiPoolData(
    App,
    CRV_TOKEN,
    SUSHI_TOKEN,
    crvEthPoolToken,
    masterChefStakingPool,
    crvEthPoolData,
    WETH_TOKEN,
    crvEthPoolId
  )
