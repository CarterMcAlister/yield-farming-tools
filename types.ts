export enum RiskLevel {
  NONE = 'None',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  EXTREME = 'Extreme',
}

export enum SortOrder {
  Lowest,
  Highest,
  Newest,
  Oldest,
  Provider,
}

export enum FilterOptions {
  ShowLowApr,
  ShowLowLiquidity,
  OnlyMyPools,
  OnlyMyRewards,
}

export type TokenData = {
  address: string
  ABI: any
  ticker?: string
  tokenId?: string
  numBase?: number
}

export type RiskProfile = {
  smartContract: RiskLevel
  impermanentLoss: RiskLevel
}

export type PoolData = {
  provider: string
  name: string
  links: Array<Object>
  added: string
  risk?: RiskProfile
}
