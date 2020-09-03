import {
  ALINK_TOKEN_ADDR,
  BASED_TOKEN_ADDR,
  COMP_TOKEN_ADDR,
  CREAM_TOKEN_ADDR,
  DICE_TOKEN_ADDR,
  ERC20_ABI,
  LEND_TOKEN_ADDR,
  LINK_TOKEN_ADDR,
  MKR_TOKEN_ADDR,
  PASTA_TOKEN_ADDR,
  SHRIMP_TOKEN_ADDR,
  SNX_TOKEN_ADDRESS,
  WBTC_TOKEN_ADDR,
  WETH_TOKEN_ADDR,
  YAM_CLASSIC_ADDR,
  YAM_TOKEN_ABI,
  YAM_TOKEN_ADDR,
  YCRV_TOKEN_ADDR,
  YFI_TOKEN_ADDR,
} from './constants'
import { TokenData } from '../types'

export const YCRV_TOKEN: TokenData = {
  address: YCRV_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'yCRV',
  tokenId: 'curve-fi-ydai-yusdc-yusdt-ytusd',
}

export const YYCRV_TOKEN: TokenData = {
  address: '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c',
  ABI: ERC20_ABI,
  ticker: 'yyCRV',
  tokenId: 'curve-fi-ydai-yusdc-yusdt-ytusd',
}

export const YAM_TOKEN: TokenData = {
  address: YAM_TOKEN_ADDR,
  ABI: YAM_TOKEN_ABI,
  ticker: 'YAM',
  tokenId: 'yam',
}

export const YAM_CLASSIC_TOKEN: TokenData = {
  address: YAM_CLASSIC_ADDR,
  ABI: YAM_TOKEN_ABI,
  ticker: 'YAM2',
}

export const YFI_TOKEN: TokenData = {
  address: YFI_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'YFI',
  tokenId: 'yearn-finance',
}

export const COMP_TOKEN: TokenData = {
  address: COMP_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'COMP',
  tokenId: 'compound-governance-token',
}

export const LEND_TOKEN: TokenData = {
  address: LEND_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'LEND',
  tokenId: 'ethlend',
}

export const LINK_TOKEN: TokenData = {
  address: LINK_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'LINK',
  tokenId: 'chainlink',
}

export const ALINK_TOKEN: TokenData = {
  address: ALINK_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'aLINK',
  tokenId: 'chainlink',
}

export const MKR_TOKEN: TokenData = {
  address: MKR_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'MKR',
  tokenId: 'maker',
}

export const SNX_TOKEN: TokenData = {
  address: SNX_TOKEN_ADDRESS,
  ABI: ERC20_ABI,
  ticker: 'SNX',
  tokenId: 'havven',
}

export const WETH_TOKEN: TokenData = {
  address: WETH_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'WETH',
  tokenId: 'ethereum',
}

export const SHRIMP_TOKEN: TokenData = {
  address: SHRIMP_TOKEN_ADDR,
  ABI: YAM_TOKEN_ABI,
  ticker: 'SHRIMP',
  tokenId: 'shrimp-finance',
}

export const CREAM_TOKEN: TokenData = {
  address: CREAM_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'CREAM',
  tokenId: 'cream-2',
}

export const DICE_TOKEN: TokenData = {
  address: DICE_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'DICE',
  tokenId: 'cream-2',
}

export const PASTA_TOKEN: TokenData = {
  address: PASTA_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'PASTA',
  tokenId: 'spaghetti',
}

export const WBTC_TOKEN: TokenData = {
  address: WBTC_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'WBTC',
}

export const BASED_TOKEN: TokenData = {
  address: BASED_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'BASED',
  tokenId: 'based-money',
}
export const ZOMBIE_TOKEN: TokenData = {
  address: '0xd55BD2C12B30075b325Bc35aEf0B46363B3818f8',
  ABI: ERC20_ABI,
  ticker: 'ZOMBIE',
  tokenId: 'zombie-finance',
}

export const SUSHI_TOKEN: TokenData = {
  address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  ABI: ERC20_ABI,
  ticker: 'SUSHI',
  tokenId: 'sushi',
}

export const UMA_TOKEN: TokenData = {
  address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  ABI: ERC20_ABI,
  ticker: 'UMA',
  tokenId: 'uma',
}

export const BAND_TOKEN: TokenData = {
  address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
  ABI: ERC20_ABI,
  ticker: 'BAND',
  tokenId: 'band-protocol',
}

export const TETHER_TOKEN: TokenData = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ABI: ERC20_ABI,
  ticker: 'USDT',
  tokenId: 'tether',
  numBase: 1e6,
}

export const AMPL_TOKEN: TokenData = {
  address: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
  ABI: ERC20_ABI,
  ticker: 'AMPL',
  tokenId: 'ampleforth',
  numBase: 1e9,
}

export const DAI_TOKEN: TokenData = {
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  ABI: ERC20_ABI,
  ticker: 'DAI',
  tokenId: 'dai',
}

export const USDC_TOKEN: TokenData = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  ABI: ERC20_ABI,
  ticker: 'USDC',
  tokenId: 'usd-coin',
  numBase: 1e6,
}

export const SUSD_TOKEN: TokenData = {
  address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  ABI: ERC20_ABI,
  ticker: 'sUSD',
  tokenId: 'nusd',
}

export const YFV_TOKEN: TokenData = {
  address: '0x45f24BaEef268BB6d63AEe5129015d69702BCDfa',
  ABI: ERC20_ABI,
  ticker: 'YFV',
  tokenId: 'yfv-finance',
}

export const BAL_TOKEN: TokenData = {
  address: '0xba100000625a3754423978a60c9317c58a424e3D',
  ABI: ERC20_ABI,
  ticker: 'BAL',
  tokenId: 'balancer',
}

export const BAT_TOKEN: TokenData = {
  address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  ABI: ERC20_ABI,
  ticker: 'BAT',
  tokenId: 'basic-attention-token',
}

export const REN_TOKEN: TokenData = {
  address: '0x408e41876cccdc0f92210600ef50372656052a38',
  ABI: ERC20_ABI,
  ticker: 'REN',
  tokenId: 'republic-protocol',
}

export const KNC_TOKEN: TokenData = {
  address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  ABI: ERC20_ABI,
  ticker: 'KNC',
  tokenId: 'kyber-network',
}
