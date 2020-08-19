import {
  YAM_TOKEN_ABI,
  YAM_TOKEN_ADDR,
  YFI_TOKEN_ADDR,
  ERC20_ABI,
  COMP_TOKEN_ADDR,
  LEND_TOKEN_ADDR,
  LINK_TOKEN_ADDR,
  MKR_TOKEN_ADDR,
  SNX_TOKEN_ADDRESS,
  WETH_TOKEN_ADDR,
  YCRV_TOKEN_ADDR,
  YAM_CLASSIC_ADDR,
  SHRIMP_TOKEN_ADDR,
  CREAM_TOKEN_ADDR,
  DICE_TOKEN_ADDR,
} from '../../constants'
import { TokenData } from '../pool-templates/snx-based'

export const YCRV_TOKEN: TokenData = {
  address: YCRV_TOKEN_ADDR,
  ABI: ERC20_ABI,
  ticker: 'yCrv',
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
