import axios from 'axios'
import { balRewards } from './bal-rewards-constants'
import * as Constants from './constants'

declare global {
  interface Window {
    ethereum: any
    web3: any
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

export const lookUpPrices = async function (id_array) {
  let ids = id_array.join('%2C')
  const prices = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  )
  return prices.data
}

export const getPrices = async function (ids) {
  let idString = ids.join('%2C')
  const prices = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd`
  )
  const priceMap = ids.map((id) => prices.data[id].usd)
  return priceMap
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

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const toDollar = formatter.format

export const toNumber = (numString) =>
  parseFloat(numString?.split('$').join('').split(',').join('') || '0')
