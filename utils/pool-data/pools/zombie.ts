import {
  ERC20_ABI,
  YFFI_REWARD_CONTRACT_ABI,
  Y_STAKING_POOL_ABI,
} from '../../../data/constants'
import { DAI_TOKEN, SHRIMP_TOKEN, ZOMBIE_TOKEN } from '../../../data/token-data'
import { PoolData, RiskLevel, TokenData } from '../../../types'
import { getSnxBasedStakingData } from '../../pool-templates/staking'
import { getSnxBasedUniPoolStakingData } from '../../pool-templates/uniswap-staking'

const poolData: PoolData = {
  provider: 'Zombie',
  name: 'Zombie',
  added: '2020-08-24 18:54:20',
  links: [
    {
      title: 'Info',
      link: 'https://twitter.com/ZombieFinance',
    },
    {
      title: 'Staking',
      link: 'https://zombie.finance/',
    },
  ],
}

const daiStakingPool: TokenData = {
  address: '0xd55BD2C12B30075b325Bc35aEf0B46363B3818f8',
  ABI: Y_STAKING_POOL_ABI,
}
export const daiPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    DAI_TOKEN,
    ZOMBIE_TOKEN,
    daiStakingPool,
    poolData
  )

const shrimpStakingPool: TokenData = {
  address: '0xa8ed29d39Ec961Ded44451D38e56B609Fe08126e',
  ABI: Y_STAKING_POOL_ABI,
}
export const shrimpPool = async (App) =>
  await getSnxBasedStakingData(
    App,
    SHRIMP_TOKEN,
    ZOMBIE_TOKEN,
    shrimpStakingPool,
    poolData
  )

const daiZombieUniTokenStakingPool: TokenData = {
  address: '0xc83e9d6bc93625863ffe8082c37ba6da81399c47',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const daiZombiePoolToken: TokenData = {
  address: '0xd55BD2C12B30075b325Bc35aEf0B46363B3818f8',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const daiZombiePoolData = Object.assign({}, poolData, {
  name: 'Uniswap',
  risk: {
    smartContract: RiskLevel.HIGH,
    impermanentLoss: RiskLevel.HIGH,
  },
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xc83e9d6bc93625863ffe8082c37ba6da81399c47',
    },
  ],
})

export const daiZombieUniPool = async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    DAI_TOKEN,
    ZOMBIE_TOKEN,
    daiZombiePoolToken,
    daiZombieUniTokenStakingPool,
    daiZombiePoolData
  )

const ethShrimpUniTokenStakingPool: TokenData = {
  address: '0xc83e9d6bc93625863ffe8082c37ba6da81399c47',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const ethShrimpPoolToken: TokenData = {
  address: '0xd55BD2C12B30075b325Bc35aEf0B46363B3818f8',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}
const ethShrimpPoolData = Object.assign({}, poolData, {
  name: 'Uniswap',
  risk: {
    smartContract: RiskLevel.HIGH,
    impermanentLoss: RiskLevel.HIGH,
  },
  links: [
    ...poolData.links,
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xeba5d22bbeb146392d032a2f74a735d66a32aee4',
    },
  ],
})

export const ethShrimpUniPool = async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    DAI_TOKEN,
    ZOMBIE_TOKEN,
    ethShrimpPoolToken,
    ethShrimpUniTokenStakingPool,
    ethShrimpPoolData
  )
