import React, { createContext, useContext, useEffect, useState } from 'react'
import { connectToWeb3, initInfura } from '../hooks/useEthers'
import { PLACEHOLDER_ADDRESS } from '../utils/constants'

const Context = createContext(null)

export const EthContext = ({ children }) => {
  const [ethApp, setEthApp] = useState()

  const setEthProvider = async () => {
    try {
      const app = await connectToWeb3()
      setEthApp(app)
    } catch {
      const app = await initInfura(PLACEHOLDER_ADDRESS)
      setEthApp(app)
    }
  }

  useEffect(() => {
    setEthProvider()
  }, [])

  return (
    <Context.Provider value={{ ethApp, setEthProvider, setEthApp }}>
      {children}
    </Context.Provider>
  )
}

export const useEthContext = () => useContext(Context)
