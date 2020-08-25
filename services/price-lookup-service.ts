import axios from 'axios'

type TokenPrices = {
  [key: string]: number
}

class PriceLookupService {
  tokenPrices: TokenPrices = {}

  public async getPrices(tokenIds: Array<string>) {
    const pricesToFetch = tokenIds.filter(
      (tokenId) => !(tokenId in this.tokenPrices)
    )
    if (pricesToFetch.length > 0) {
      await this.getCoingeckoPrices(pricesToFetch)
    }
    return this.tokenPrices
  }

  private async getCoingeckoPrices(ids) {
    let idString = ids.join('%2C')
    const prices = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd`
    )
    const fetchedPrices = {}
    ids.forEach((id) => {
      fetchedPrices[id] = prices.data[id].usd
    })
    Object.assign(this.tokenPrices, fetchedPrices)
  }
}

const priceLookupService = new PriceLookupService()
export { priceLookupService }
