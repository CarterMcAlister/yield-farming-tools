import axios from 'axios'

type TokenPrices = {
  [key: string]: number
}

class LogoLookupService {
  tokenLogos: TokenPrices = {}

  public async getLogo(tokenId: string) {
    if (!(tokenId in this.tokenLogos)) {
      await this.getLogoFromCoingecko(tokenId)
    }
    return this.tokenLogos
  }

  private async getLogoFromCoingecko(id) {
    const tokenData = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}?tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    )
    const logo = tokenData?.data?.image?.small
    Object.assign(this.tokenLogos, { logo })
  }
}

const logoLookupService = new LogoLookupService()
export { logoLookupService }
