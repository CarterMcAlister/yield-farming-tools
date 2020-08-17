import axios from 'axios'
import { ethers } from 'ethers'
import { balRewards } from './bal-rewards-constants'
import * as Constants from './constants'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export enum RiskLevel {
  NONE = 'None',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  EXTREME = 'Extreme',
}

export const riskBlurbs = {
  il: {
    [RiskLevel.LOW]:
      'This contract is not a split pool, so there is no risk of impermanent loss.',
    [RiskLevel.MEDIUM]:
      'This is a split pool, impermanent loss could occur if there is an extreme price change.',
    [RiskLevel.HIGH]:
      'This is a split pool with tokens that could be minted and used to drain the pool. Use at your own risk.',
  },
  sc: {
    [RiskLevel.LOW]: 'This smart contract has been professionally audited.',
    [RiskLevel.MEDIUM]:
      'This smart contract is based on a tested contract, but has not been audited.',
    [RiskLevel.HIGH]:
      'This smart contract is unaudited and experimental. Use at your own risk.',
  },
}

export async function connectToWallet() {
  const App: any = {}

  // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum
    try {
      // Request account access
      await window.ethereum.enable()
    } catch (error) {
      // User denied account access...
      console.error('User denied account access')
      throw 'User denied account access'
    }
    App.provider = new ethers.providers.Web3Provider(window.ethereum)
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    )
  }
  // No injected web3 instance
  else {
    throw 'No metamask instance found'
  }

  if (!App.YOUR_ADDRESS) {
    const accounts = await App.provider.listAccounts()
    App.YOUR_ADDRESS = accounts[0]
  }

  if (!App.YOUR_ADDRESS || !ethers.utils.isAddress(App.YOUR_ADDRESS)) {
    throw 'Could not initialize your address. Make sure your address is checksum valid.'
  }

  localStorage.setItem('addr', App.YOUR_ADDRESS)
  return App
}

export async function initInfura(address?: string) {
  const App: any = {}

  App.provider = new ethers.providers.InfuraProvider('homestead')
  sleep(10)

  App.YOUR_ADDRESS = address || getUrlParameter('addr')

  // Cloud not load URL parameter
  if (!App.YOUR_ADDRESS) {
    if (localStorage.hasOwnProperty('addr')) {
      App.YOUR_ADDRESS = localStorage.getItem('addr')
    } else {
      App.YOUR_ADDRESS = Constants.PLACEHOLDER_ADDRESS
    }
  }

  if (!App.YOUR_ADDRESS || !ethers.utils.isAddress(App.YOUR_ADDRESS)) {
    throw 'Could not initialize your address. Make sure your address is checksum valid.'
  }

  localStorage.setItem('addr', App.YOUR_ADDRESS)
  return App
}

const getUrlParameter = function (sParam) {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=')

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1])
    }
  }
}

export const toFixed = function (num, fixed) {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
  const arr = num.toString().match(re)
  if (arr && arr.length > 0) {
    return arr[0]
  } else {
    return '0'
  }
}

const sleep = function (milliseconds) {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

export const lookUpPrices = async function (id_array) {
  let ids = id_array.join('%2C')
  const prices = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  )
  return prices.data
}

export const getBlockTime = function () {
  return new Promise((resolve, reject) => {
    fetch('https://etherchain.org/api/basic_stats', { method: 'GET' })
      .then((data) => {
        if (data['currentStats'] && data['currentStats']['block_time']) {
          resolve(data['currentStats']['block_time'])
          return
        }

        resolve(Constants.BLOCK_TIME)
      })
      .catch((request) => {
        resolve(Constants.BLOCK_TIME)
      })
  })
}

export const printBALRewards = async function (
  synthStakingPoolAddr,
  BALPrice,
  percentageOfBalancerPool
) {}

export const getLatestTotalBALAmount = async function (addr) {
  const bal_earnings = await getBALEarnings(
    addr,
    Constants.BAL_DISTRIBUTION_WEEK - 1
  )
  return bal_earnings[0]
}

const safeParseFloat = function (str) {
  let res = parseFloat(str)
  return res ? res : 0
}

const getBALEarnings = async function (addr, startWeek) {
  // SNX-usdc Redirect
  if (addr.toLowerCase() === '0xfbaedde70732540ce2b11a8ac58eb2dc0d69de10') {
    addr = '0xEb3107117FEAd7de89Cd14D463D340A2E6917769'
  }

  const bal_earnings = []

  for (let i = startWeek; i < Constants.BAL_DISTRIBUTION_WEEK; i++) {
    const data = balRewards[i + 1]
    const earning_checksum = safeParseFloat(data[addr])

    if (earning_checksum === 0) {
      const earning =
        safeParseFloat(data[addr.toLowerCase()]) + earning_checksum
      bal_earnings.push(earning)
    } else {
      bal_earnings.push(earning_checksum)
    }
  }

  return bal_earnings
}

export const get_synth_weekly_rewards = async function (
  synth_contract_instance
) {
  if (await isRewardPeriodOver(synth_contract_instance)) {
    return 0
  }

  const rewardRate = await synth_contract_instance.rewardRate()

  return Math.round((rewardRate / 1e18) * 604800)
}

const isRewardPeriodOver = async function (reward_contract_instance) {
  const now = Date.now() / 1000
  const periodFinish = await reward_period_end(reward_contract_instance)
  return periodFinish < now
}

const reward_period_end = async function (reward_contract_instance) {
  return await reward_contract_instance.periodFinish()
}

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9)
}

export function sleep_async(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the the amount of time
 */
export const forHumans = function (seconds) {
  const levels: Array<[number, string]> = [
    [Math.floor(seconds / 31536000), 'years'],
    [Math.floor((seconds % 31536000) / 86400), 'days'],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) % 60), 'seconds'],
  ]
  let returntext = ''

  for (var i = 0, max = levels.length; i < max; i++) {
    if (levels[i][0] === 0) continue
    returntext +=
      ' ' +
      levels[i][0] +
      ' ' +
      (levels[i][0] === 1
        ? levels[i][1].substr(0, levels[i][1].length - 1)
        : levels[i][1])
  }

  return returntext.trim()
}

export const toDollar = formatter.format

export const getPeriodFinishForReward = async function (
  reward_contract_instance
) {
  return await reward_contract_instance.periodFinish()
}

export const trimOrFillTo = function (str, n) {
  str = str + ''

  if (str.length < n) {
    str = str.padEnd(n, ' ')
  } else {
    str = str.substr(0, n - 4).padEnd(n, '.')
  }

  return str
}
