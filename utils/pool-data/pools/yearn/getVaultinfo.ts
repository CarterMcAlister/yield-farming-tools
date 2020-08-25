import { ethers } from 'ethers'
import {
  CURVE_Y_POOL_ABI,
  CURVE_Y_POOL_ADDR,
  DELEGATED_VAULT_ABI,
  ERC20_ABI,
  YEARN_DELEGATED_VAULT_CONTROLLER_ABI,
  YEARN_DELEGATED_VAULT_CONTROLLER_ADDR,
  YEARN_VAULT_ABI,
  YEARN_VAULT_CONTROLLER_ABI,
  YEARN_VAULT_CONTROLLER_ADDR,
} from '../../../../data/constants'
import { priceLookupService } from '../../../../services/price-lookup-service'
import { getBlockTime, toDollar, toFixed } from '../../../utils'
import { RiskLevel } from '../../../../types'

type Token = {
  ticker: string
  coingeckoId: string
  tokenAddr: string
}

class YearnVault {
  YEARN_VAULT_CONTROLLER: ethers.Contract
  YAERN_DELEGATED_VAULT_CONTROLLER: ethers.Contract
  CURVE_Y_POOL: ethers.Contract
  currentBlockTime: number
  oneDayInBlocks: number
  oneWeekInBlocks: number
  currentBlockNumber: any
  app: any

  public async init(App) {
    if (this.app) {
      return
    }
    this.app = App
    this.YEARN_VAULT_CONTROLLER = new ethers.Contract(
      YEARN_VAULT_CONTROLLER_ADDR,
      YEARN_VAULT_CONTROLLER_ABI,
      App.provider
    )
    this.YAERN_DELEGATED_VAULT_CONTROLLER = new ethers.Contract(
      YEARN_DELEGATED_VAULT_CONTROLLER_ADDR,
      YEARN_DELEGATED_VAULT_CONTROLLER_ABI,
      App.provider
    )

    this.CURVE_Y_POOL = new ethers.Contract(
      CURVE_Y_POOL_ADDR,
      CURVE_Y_POOL_ABI,
      App.provider
    )

    this.currentBlockTime = (await getBlockTime()) as number
    this.oneDayInBlocks = (24 * 60 * 60) / this.currentBlockTime
    this.oneWeekInBlocks = this.oneDayInBlocks * 7
    this.currentBlockNumber = await App.provider.getBlockNumber()
  }

  public async getVaultData(token: Token, App) {
    await this.init(App)
    const {
      [token.coingeckoId]: tokenPrice,
    } = await priceLookupService.getPrices([token.coingeckoId])
    const tokenTicker = token.ticker
    const tokenAddr = token.tokenAddr

    const vaultAddress = await this.YEARN_VAULT_CONTROLLER.vaults(tokenAddr)
    const tokenContract = new ethers.Contract(
      tokenAddr,
      ERC20_ABI,
      this.app.provider
    )
    const vaultContract = new ethers.Contract(
      vaultAddress,
      YEARN_VAULT_ABI,
      this.app.provider
    )

    const currentPricePerFullShare = await vaultContract.getPricePerFullShare()
    const tokenBalance =
      (await vaultContract.balance()) /
      10 ** parseInt(await tokenContract.decimals())

    let ROI_day = 0
    let ROI_week = 0
    let yourVaultBalance

    try {
      const pastPricePerFullShare = await vaultContract.getPricePerFullShare({
        blockTag: Math.round(this.currentBlockNumber - this.oneDayInBlocks),
      })
      ROI_day = (currentPricePerFullShare / pastPricePerFullShare - 1) * 100
    } catch (e) {
      console.error(e)
    }

    try {
      const pastPricePerFullShare = await vaultContract.getPricePerFullShare({
        blockTag: Math.round(this.currentBlockNumber - this.oneWeekInBlocks),
      })
      ROI_week = (currentPricePerFullShare / pastPricePerFullShare - 1) * 100
    } catch (e) {
      console.error(e)
    }

    try {
      const decimal = 10 ** (await vaultContract.decimals())
      const yourVaultTokenAmount =
        (await vaultContract.balanceOf(App.YOUR_ADDRESS)) / decimal
      const yourVaultTokenInUnderlyingTokenAmount =
        (yourVaultTokenAmount * currentPricePerFullShare) / 1e18
      yourVaultBalance = yourVaultTokenInUnderlyingTokenAmount * tokenPrice
    } catch (e) {
      console.error(e)
    }

    return {
      tokenTicker: tokenTicker,
      tokenAddr: tokenAddr,
      tokenPrice: tokenPrice,
      tokenContractInstance: tokenContract,
      vaultContractInstance: vaultContract,
      vaultTicker: await vaultContract.symbol(),
      tokenBalance: tokenBalance,
      balanceInUSD: tokenBalance * tokenPrice,
      currentPricePerFullShare: currentPricePerFullShare,
      yourVaultBalance: yourVaultBalance,
      ROI_day: ROI_day,
      ROI_week: ROI_week,
      strategyAddr: await this.YEARN_VAULT_CONTROLLER.strategies(tokenAddr),
      strategyName: '',
      //
      apr: toFixed(ROI_week * 52, 4),
      risk: {
        smartContract: RiskLevel.LOW,
        impermanentLoss: RiskLevel.NONE,
      },
      prices: [{ label: tokenTicker, value: toDollar(tokenPrice) }],
      staking: [
        {
          label: 'Pool Total',
          value: toDollar(tokenBalance),
        },
        {
          label: 'Your Total',
          value: toDollar(yourVaultBalance),
        },
      ],
      ROIs: [
        {
          label: 'Hourly',
          value: `${toFixed(ROI_week / 7 / 24, 4)}%`,
        },
        {
          label: 'Daily',
          value: `${toFixed(ROI_week / 7, 4)}%`,
        },
        {
          label: 'Weekly',
          value: `${toFixed(ROI_week, 4)}%`,
        },
      ],
    }
  }

  public async getDelegatedVaultData(token: Token, App) {
    await this.init(App)
    const {
      [token.coingeckoId]: tokenPrice,
    } = await priceLookupService.getPrices([token.coingeckoId])
    const tokenTicker = token.ticker
    const delegatedVaultAddr = token.tokenAddr

    const delegatedVaultContract = new ethers.Contract(
      delegatedVaultAddr,
      DELEGATED_VAULT_ABI,
      this.app.provider
    )

    const tokenAddr = await delegatedVaultContract.underlying()
    const tokenContract = new ethers.Contract(
      tokenAddr,
      ERC20_ABI,
      this.app.provider
    )

    const tokenBalance =
      (await delegatedVaultContract.balance()) /
      10 ** parseInt(await tokenContract.decimals())
    const currentPricePerFullShare = await delegatedVaultContract.getPricePerFullShare()

    let ROI_day = 0
    let ROI_week = 0
    let yourVaultBalance

    try {
      const pastPricePerFullShare = await delegatedVaultContract.getPricePerFullShare(
        { blockTag: Math.round(this.currentBlockNumber - this.oneDayInBlocks) }
      )
      ROI_day = (currentPricePerFullShare / pastPricePerFullShare - 1) * 100
    } catch (e) {
      console.error(e)
    }

    try {
      const pastPricePerFullShare = await delegatedVaultContract.getPricePerFullShare(
        { blockTag: Math.round(this.currentBlockNumber - this.oneWeekInBlocks) }
      )
      ROI_week = (currentPricePerFullShare / pastPricePerFullShare - 1) * 100
    } catch (e) {
      console.error(e)
    }

    try {
      const decimal = 10 ** (await delegatedVaultContract.decimals())
      const yourVaultTokenAmount =
        (await delegatedVaultContract.balanceOf(App.YOUR_ADDRESS)) / decimal
      const yourVaultTokenInUnderlyingTokenAmount =
        (yourVaultTokenAmount * currentPricePerFullShare) / 1e18
      yourVaultBalance = yourVaultTokenInUnderlyingTokenAmount * tokenPrice
    } catch (e) {
      console.error(e)
    }

    return {
      tokenTicker: tokenTicker,
      tokenAddr: await delegatedVaultContract.underlying(),
      tokenPrice: tokenPrice,
      tokenContractInstance: tokenContract,
      vaultContractInstance: delegatedVaultContract,
      vaultTicker: await delegatedVaultContract.symbol(),
      tokenBalance: tokenBalance,
      balanceInUSD: tokenBalance * tokenPrice,
      currentPricePerFullShare: currentPricePerFullShare,
      ROI_day: ROI_day,
      ROI_week: ROI_week,
      strategyAddr: await this.YAERN_DELEGATED_VAULT_CONTROLLER.strategies(
        delegatedVaultAddr
      ),
      strategyName: '',
      //
      apr: toFixed(ROI_week * 52, 4),
      prices: [{ label: tokenTicker, value: toDollar(tokenPrice) }],
      risk: {
        smartContract: RiskLevel.LOW,
        impermanentLoss: RiskLevel.LOW,
      },
      staking: [
        {
          label: 'Pool Total',
          value: toDollar(tokenBalance),
        },
        {
          label: 'Your Total',
          value: toDollar(yourVaultBalance),
        },
      ],
      ROIs: [
        {
          label: 'Hourly',
          value: `${toFixed(ROI_week / 7 / 24, 4)}%`,
        },
        {
          label: 'Daily',
          value: `${toFixed(ROI_week / 7, 4)}%`,
        },
        {
          label: 'Weekly',
          value: `${toFixed(ROI_week, 4)}%`,
        },
      ],
    }
  }
}

const yearnVault = new YearnVault()

export { yearnVault }
