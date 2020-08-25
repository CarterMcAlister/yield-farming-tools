import { TUSD_TOKEN_ADDR } from '../../../../data/constants'
import { yearnVault } from './getVaultinfo'

export default async function main(App) {
  const params = {
    ticker: 'TUSD',
    coingeckoId: 'true-usd',
    tokenAddr: TUSD_TOKEN_ADDR,
  }
  const vault = await yearnVault.getVaultData(params, App)

  return {
    provider: 'Yearn',
    name: `${params.ticker} Vault`,
    poolRewards: [params.ticker],
    links: [
      {
        title: 'Info',
        link: 'https://medium.com/iearn/yearn-finance-v2-af2c6a6a3613',
      },
      {
        title: 'Pool',
        link: 'https://yearn.finance/vaults',
      },
    ],
    ...vault,
  }
}
