import { ethers } from 'ethers'
import * as Constants from './constants'
import { balRewards } from './bal-rewards-constants'
import axios from 'axios'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}
const _print = console.log

export async function initEthers() {
  const App: any = {}

  const ETHEREUM_NODE_URL =
    'aHR0cHM6Ly9tYWlubmV0LmluZnVyYS5pby92My9mN2Q1YjkwMzY3MzY0YmFkYWNhZDI5Njg5OWYyMTMxYQ=='

  let isMetaMaskInstalled = true

  // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum
    try {
      // Request account access
      await window.ethereum.enable()
    } catch (error) {
      // User denied account access...
      console.error('User denied account access')
    }
    App.provider = new ethers.providers.Web3Provider(window.ethereum)
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    )
  }
  // If no injected web3 instance is detected, fall back to backup node
  else {
    App.provider = new ethers.providers.JsonRpcProvider(atob(ETHEREUM_NODE_URL))
    isMetaMaskInstalled = false
    _print(
      "You don't have MetaMask installed! Falling back to backup node...\n (will likely to fail. Please install MetaMask extension).\n"
    )
    sleep(10)
  }

  App.YOUR_ADDRESS = getUrlParameter('addr')

  // Cloud not load URL parameter
  if (!App.YOUR_ADDRESS) {
    if (!isMetaMaskInstalled) {
      if (localStorage.hasOwnProperty('addr')) {
        App.YOUR_ADDRESS = localStorage.getItem('addr')
      } else {
        App.YOUR_ADDRESS = window.prompt('Enter your eth address.')
      }
    } else {
      let accounts = await App.provider.listAccounts()
      App.YOUR_ADDRESS = accounts[0]
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

const start = function (f) {
  f().catch((e) => {
    _print(e)
    console.error(e)
    _print('Oops something went wrong. Try refreshing the page.')
  })
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
  console.log('prices', prices.data)
  return prices.data
}

export const getBlockTime = function () {
  _print('Fetching current block time...')
  return new Promise((resolve, reject) => {
    fetch('https://etherchain.org/api/basic_stats', { method: 'GET' })
      .then((data) => {
        if (data['currentStats'] && data['currentStats']['block_time']) {
          resolve(data['currentStats']['block_time'])
          return
        }

        _print(`Etherchain basic stats is invalid. ${data}`)
        _print('Using backup data...')
        resolve(Constants.BLOCK_TIME)
      })
      .catch((request) => {
        _print('Could not get etherchain basic stats.')
        _print(request.responseText)
        _print('Using backup data...')
        resolve(Constants.BLOCK_TIME)
      })
    // $.ajax({
    //   url: 'https://etherchain.org/api/basic_stats',
    //   type: 'GET',
    //   success: function (data, text) {
    //     if (data['currentStats'] && data['currentStats']['block_time']) {
    //       resolve(data['currentStats']['block_time'])
    //       return
    //     }

    //     _print(`Etherchain basic stats is invalid. ${data}`)
    //     _print('Using backup data...')
    //     resolve(BLOCK_TIME)
    //   },
    //   error: function (request, status, error) {
    //     _print('Could not get etherchain basic stats.')
    //     _print(request.responseText)
    //     _print('Using backup data...')
    //     resolve(BLOCK_TIME)
    //   },
    // })
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
