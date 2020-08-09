import getPoolData from '../utils/pool-data'

interface PoolDataType {
  apr?: string
  [key: string]: unknown
}

type PoolData = {
  icon?: string
  name: string
  provider: string
  poolData: PoolDataType
  poolRewards: Array<String>
  getPoolData: Function
}

const poolDataList: Array<PoolData> = [
  {
    provider: 'Synthetix',
    name: 'Curve sUSD',
    poolData: {},
    poolRewards: ['SNX', 'CRV'],
    getPoolData: getPoolData.susd,
  },
  // {
  //   provider: 'Synthetix',
  //   name: 'Synthetix iETH',
  //   poolData: {},
  //   poolRewards: ['SNX'],
  //   getPoolData: getPoolData.ieth,
  // },
  {
    provider: 'Synthetix',
    name: 'Synthetix iBTC',
    poolData: {},
    poolRewards: ['SNX'],
    getPoolData: getPoolData.ibtc,
  },
  {
    provider: 'Synthetix & Ren',
    name: 'Curve sBTC',
    poolData: {},
    poolRewards: ['SNX', 'CRV', 'REN', 'BAL'],
    getPoolData: getPoolData.sbtc,
  },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Curve yCRV',
  //   poolData: {},
  //   poolRewards: ['YFI', 'CRV'],
  //   getPoolData: getPoolData.ygov_ycrv,
  // },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Balancer YFI-DAI',
  //   poolData: {},
  //   poolRewards: ['YFI', 'BAL'],
  //   getPoolData: getPoolData.ygov_balancer,
  // },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Balancer YFI-yCRV',
  //   poolData: {},
  //   poolRewards: ['YFI', 'CRV', 'BAL', 'yCRV'],
  //   getPoolData: getPoolData.ygov_ycrv_balancer,
  // },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-USDC',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_usdc,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-WETH',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_weth,
  },
  {
    provider: 'mStable',
    name: 'mUSD-MTA 80-20',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_mta,
  },
  {
    provider: 'mStable',
    name: 'mUSD-MTA 95-5',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_mta_2,
  },
  {
    provider: 'mStable',
    name: 'Balancer MTA-wETH',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.mta_weth,
  },
  {
    provider: 'UMA Project',
    name: 'Balancer yUSD-USDC',
    poolData: {},
    poolRewards: ['UMA', 'BAL'],
    getPoolData: getPoolData.yusd_usdc,
  },
  {
    provider: 'yfii.finance',
    name: 'Curve-yCRV',
    poolData: {},
    poolRewards: ['YFII', 'CRV'],
    getPoolData: getPoolData.yfii_ycrv,
  },
  {
    provider: 'yfii.finance',
    name: 'Balancer YFII-DAI',
    poolData: {},
    poolRewards: ['YFII', 'BAL'],
    getPoolData: getPoolData.yfii_dai,
  },
  {
    provider: 'yffi.finance',
    name: 'Curve yCRV',
    poolData: {},
    poolRewards: ['YFFI', 'CRV'],
    getPoolData: getPoolData.yffi,
  },
  {
    provider: 'yffi.finance',
    name: 'Balancer YFFI-DAI',
    poolData: {},
    poolRewards: ['YFFI', 'BAL'],
    getPoolData: getPoolData.yffi_dai,
  },
  {
    provider: 'yffi.finance',
    name: 'Balancer YFFI-yCRV',
    poolData: {},
    poolRewards: ['YFFI', 'CRV', 'BAL'],
    getPoolData: getPoolData.yffi_ycrv,
  },
  {
    provider: 'dForce',
    name: 'Uniswap GOLDx-USDx',
    poolData: {},
    poolRewards: ['DF'],
    getPoolData: getPoolData.goldx_usdx,
  },
  {
    provider: 'dForce',
    name: 'Uniswap DF-USDx',
    poolData: {},
    poolRewards: ['DF'],
    getPoolData: getPoolData.df_usdx,
  },
  {
    provider: 'dForce',
    name: 'dUSDT/dUSDC/dDAI',
    poolData: {},
    poolRewards: ['DF'],
    getPoolData: getPoolData.dUSDT_dUSDC_dDAI,
  },
]

export default poolDataList
