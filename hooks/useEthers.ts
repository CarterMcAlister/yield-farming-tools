import { ethers } from 'ethers'
import * as Constants from '../data/constants'
import { PLACEHOLDER_ADDRESS } from '../data/constants'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export type EthersProps = {
  address?: string
  web3?: boolean
}

export async function useEthers({ address, web3 }: EthersProps) {
  let app

  if (web3) {
    app = await connectToWeb3()
  } else if (address) {
    app = await initInfura(address)
  } else {
    try {
      app = await connectToWeb3()
    } catch (e) {
      app = await initInfura(PLACEHOLDER_ADDRESS)
    }
  }
  return app
}

export async function connectToWeb3() {
  const App: any = {}

  // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum
    try {
      // Request account access
      await window.ethereum.enable()
    } catch (error) {
      // User denied account access...
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

const sleep = function (milliseconds) {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}
