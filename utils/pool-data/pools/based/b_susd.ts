import { ERC20_ABI, YFFI_REWARD_CONTRACT_ABI } from '../../../../data/constants'
import { BASED_TOKEN, SUSD_TOKEN } from '../../../../data/token-data'
import { PoolData, RiskLevel, TokenData } from '../../../../types'
import { getSnxBasedUniPoolStakingData } from '../../../pool-templates/uniswap-staking'

const poolData: PoolData = {
  provider: 'Based',
  name: 'Uniswap',
  added: '2020-08-24 18:14:46',
  risk: {
    smartContract: RiskLevel.HIGH,
    impermanentLoss: RiskLevel.HIGH,
  },
  links: [
    {
      title: 'Info',
      link: 'http://based.money/',
    },
    {
      title: 'Pool',
      link:
        'https://uniswap.info/pair/0xaAD22f5543FCDaA694B68f94Be177B561836AE57',
    },
    {
      title: 'Staking',
      link: 'https://stake.based.money/',
    },
  ],
}

const uniTokenStakingPool: TokenData = {
  address: '0x4fc7e3249A149c0bf729863f49cD2FF468F2412F',
  ABI: YFFI_REWARD_CONTRACT_ABI,
}
const uniPoolToken: TokenData = {
  address: '0xaAD22f5543FCDaA694B68f94Be177B561836AE57',
  ABI: ERC20_ABI,
  ticker: 'UNIV2',
}

export default async (App) =>
  await getSnxBasedUniPoolStakingData(
    App,
    SUSD_TOKEN,
    BASED_TOKEN,
    uniPoolToken,
    uniTokenStakingPool,
    poolData,
    uniPoolToken.address
  )
