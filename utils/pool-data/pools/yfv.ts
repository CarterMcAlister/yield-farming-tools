import {
  ERC20_ABI,
  MASTER_CHEF_ABI,
  Y_STAKING_POOL_ABI,
} from '../../../data/constants'
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
  YFV_TOKEN,
  BAL_TOKEN,
  REN_TOKEN,
  BAT_TOKEN,
  KNC_TOKEN,
} from '../../../data/token-data'
import { getSnxBasedBalPool } from '../../pool-templates/balancer-staking'

const poolData: PoolData = {
  provider: 'yfv.finance',
  name: 'Uni',
  added: '2020-09-02 22:50:58',
  risk: {
    smartContract: RiskLevel.LOW,
    impermanentLoss: RiskLevel.MEDIUM,
  },
  links: [
    {
      title: 'Info',
      link:
        'https://medium.com/@yfv.finance/farming-yfv-at-balancer-pool-92c62b122027',
    },
    {
      title: 'Staking',
      link: 'https://yfv.finance/',
    },
  ],
}

export const yfiPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x70b83A7f5E83B3698d136887253E0bf426C9A117',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0x742569fd5266486fd2a50171dbdc88B8Ee893ee9',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const yfiYfvPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    { ...YFI_TOKEN, ratio: 98 },
    { ...YFV_TOKEN, ratio: 2 },
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    yfiYfvPoolData
  )
}

export const balPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x62a9fE913eb596C8faC0936fd2F51064022ba22e',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0xc19e3035a4f6f69b981c7dc2f533e862aa3af496',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    BAL_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}

export const batPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x1c990fc37f399c935625b815975d0c9fad5c31a1',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0x471eb7dcf6647abaf838a5aad94940ce6932198c',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    BAT_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}

export const renPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x752037bfef024bd2669227bf9068cb22840174b0',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0x433d0c33288b985cf232a7e312bcfafd372460a8',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    REN_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}

export const kncPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x9b74774f55C0351fD064CfdfFd35dB002C433092',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0xbfdef139103033990082245c24ff4b23dafd88cf',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    KNC_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}

export const wethPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x67FfB615EAEb8aA88fF37cCa6A32e322286a42bb',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0x10dd17ecfc86101eab956e0a443cab3e9c62d9b4',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    WETH_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}

export const linkPool = async (App) => {
  const stakingPool: TokenData = {
    address: '0x196cf719251579cbc850ded0e47e972b3d7810cd',
    ABI: Y_STAKING_POOL_ABI,
  }
  const balPoolToken: TokenData = {
    address: '0x4b0b0bf60abbf79a2fd028e4d52ac393982488ce',
    ABI: ERC20_ABI,
    ticker: 'BPT',
  }
  const balPoolData = Object.assign({}, poolData, {
    links: [
      ...poolData.links,
      {
        title: 'Pool',
        link: `https://pools.balancer.exchange/#/pool/${balPoolToken.address}/`,
      },
    ],
  })

  return await getSnxBasedBalPool(
    App,
    LINK_TOKEN,
    YFV_TOKEN,
    YFV_TOKEN,
    balPoolToken,
    stakingPool,
    balPoolData
  )
}
