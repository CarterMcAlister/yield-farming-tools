import React, { createContext, useContext, useEffect, useState } from 'react'
import { useEthers, EthersProps } from '../hooks/useEthers'

const Context = createContext(null)

export const EthContext = ({ children }) => {
  const [ethApp, setEthApp] = useState()

  const setEthProvider = async (ethersValues?: EthersProps) => {
    const app = await useEthers(ethersValues || {})
    setEthApp(app)
  }

  useEffect(() => {
    setEthProvider()
  }, [])

  return (
    <Context.Provider value={{ ethApp, setEthProvider }}>
      {children}
    </Context.Provider>
  )
}

export const useEthContext = () => useContext(Context)
