import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Text,
} from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import { RiskLevel } from '../types'
import { toNumber } from '../utils/utils'
import { usePoolContext } from './Pools'

export const Filters = () => {
  const { pools, setFilteredPools, expandOrCollapseAll } = usePoolContext()
  const [collaterals, setCollaterals] = React.useState([])
  const [rewards, setRewards] = React.useState([])
  const [providers, setProviders] = React.useState([])

  const [selectedCollateral, setSelectedCollateral] = useState({})
  const [selectedRewards, setSelectedRewards] = useState({})
  const [selectedProviders, setSelectedProviders] = useState({})
  const [maxIlRisk, setMaxIlRisk] = useState(null)
  const [maxScRisk, setMaxScRisk] = useState(null)
  const [showOnlyMyPools, setShowOnlyMyPools] = useState(false)
  const [showLowLiq, setShowLowLiq] = useState(false)
  const [showLowApr, setShowLowApr] = useState(false)

  const clearFilters = () => {
    setMaxScRisk(null)
    setMaxIlRisk(null)
    setMaxIlRisk(null)
    setSelectedRewards(
      Object.keys(selectedRewards).reduce(objectToDefaultsReducer, {})
    )
    setSelectedCollateral(
      Object.keys(selectedCollateral).reduce(objectToDefaultsReducer, {})
    )
    setSelectedProviders(
      Object.keys(selectedProviders).reduce(objectToDefaultsReducer, {})
    )
    setShowOnlyMyPools(false)
    setShowLowLiq(false)
    setShowLowApr(false)
  }

  const getFilterData = () => {
    const collateralItems = []
    const rewardItems = []
    const providers = []
    pools?.map((item) => {
      item?.prices?.map((priceItem) => {
        if (priceItem?.label && !collateralItems?.includes(priceItem?.label)) {
          collateralItems.push(priceItem.label)
        }
      })
      item?.poolRewards?.map((rewardItem) => {
        if (rewardItem && !rewardItems?.includes(rewardItem)) {
          rewardItems.push(rewardItem)
        }
      })
      if (!providers?.includes(item?.provider)) {
        providers.push(item?.provider)
      }
    })

    setCollaterals(collateralItems.sort())
    setRewards(rewardItems.sort())
    setProviders(providers.sort())
    setSelectedCollateral(collateralItems.reduce(objectToDefaultsReducer, {}))
    setSelectedRewards(rewardItems.reduce(objectToDefaultsReducer, {}))
    setSelectedProviders(providers.reduce(objectToDefaultsReducer, {}))
  }

  const poolFilter = (item) => {
    const collateralFiltered = Object.values(selectedCollateral).reduce(
      (bool, value) => value || bool,
      false
    )
    const rewardsFiltered = Object.values(selectedRewards).reduce(
      (bool, value) => value || bool,
      false
    )
    const providersFiltered = Object.values(selectedProviders).reduce(
      (bool, value) => value || bool,
      false
    )

    let passesFilters = true

    if (showOnlyMyPools) {
      passesFilters =
        toNumber(item?.staking[1]?.value) > 0 ||
        (item?.rewards?.length > 0 && toNumber(item?.rewards[0]?.value) > 0)
    }

    if (passesFilters && !showLowApr) {
      passesFilters = toNumber(item?.apr) > 2
    }

    if (passesFilters && !showLowLiq) {
      passesFilters =
        !item?.staking[0]?.value || toNumber(item?.staking[0]?.value) > 200000
    }

    if (passesFilters && providersFiltered) {
      console.log(item?.provider, selectedProviders[item?.provider])
      passesFilters = selectedProviders[item?.provider]
    }

    if (passesFilters && maxIlRisk) {
      passesFilters = underMaxRisk(item.risk.impermanentLoss, maxIlRisk)
    }

    if (passesFilters && maxScRisk) {
      passesFilters = underMaxRisk(item.risk.smartContract, maxScRisk)
    }

    if (passesFilters && collateralFiltered) {
      passesFilters = item?.prices?.reduce(
        (bool, priceItem) => selectedCollateral[priceItem?.label] || bool,
        false
      )
    }

    if (passesFilters && rewardsFiltered) {
      passesFilters = item?.poolRewards?.reduce(
        (bool, rewardItem) => selectedRewards[rewardItem] || bool,
        false
      )
    }

    return passesFilters
  }

  useEffect(() => getFilterData(), [pools])

  useEffect(() => {
    const filteredPools = pools.filter(poolFilter)
    setFilteredPools(filteredPools)
  }, [
    pools,
    maxScRisk,
    maxIlRisk,
    selectedRewards,
    selectedCollateral,
    selectedProviders,
    showLowLiq,
    showLowApr,
    showOnlyMyPools,
  ])

  return (
    <Box>
      <Stack isInline pb={4}>
        <Button
          onClick={() => expandOrCollapseAll(true)}
          size="sm"
          variant="outline"
          d={{ xs: 'none', lg: 'block' }}
        >
          Expand All
        </Button>
        <Button
          onClick={() => expandOrCollapseAll(false)}
          size="sm"
          variant="outline"
          d={{ xs: 'none', lg: 'block' }}
        >
          Collapse All
        </Button>
        <Button onClick={clearFilters} size="sm" variant="outline">
          Clear Filters
        </Button>
      </Stack>

      <FilterSection title="Pools">
        <Stack spacing={2}>
          <Checkbox
            isChecked={showOnlyMyPools}
            onChange={(e) => setShowOnlyMyPools(e.target.checked)}
          >
            Show only my pools
          </Checkbox>
          <Checkbox
            isChecked={showLowApr}
            onChange={(e) => setShowLowApr(e.target.checked)}
          >
            Show pools with low APR
          </Checkbox>
          <Checkbox
            isChecked={showLowLiq}
            onChange={(e) => setShowLowLiq(e.target.checked)}
          >
            Show pools with low liquidity
          </Checkbox>
        </Stack>
      </FilterSection>

      <FilterSection title="Risk Level">
        <FormControl pb={4}>
          <FormLabel htmlFor="maximumSCRisk">
            Maximum Smart Contract Risk
          </FormLabel>
          <Select
            id="maximumSCRisk"
            placeholder="Choose a risk level"
            value={maxScRisk ? maxScRisk : ''}
            onChange={(e) => setMaxScRisk(e.target.value)}
          >
            <option value={RiskLevel.LOW}>Low</option>
            <option value={RiskLevel.MEDIUM}>Medium</option>
            <option value={RiskLevel.HIGH}>High</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="maximumILRisk">
            Maximum Impermanent Loss Risk
          </FormLabel>
          <Select
            id="maximumILRisk"
            placeholder="Choose a risk level"
            value={maxIlRisk ? maxIlRisk : ''}
            onChange={(e) => setMaxIlRisk(e.target.value)}
          >
            <option value={RiskLevel.NONE}>None</option>
            <option value={RiskLevel.LOW}>Low</option>
            <option value={RiskLevel.MEDIUM}>Medium</option>
            <option value={RiskLevel.HIGH}>High</option>
          </Select>
        </FormControl>
      </FilterSection>

      <FilterSection title="Provider">
        <Stack>
          {providers.map((provider) => (
            <Checkbox
              isChecked={selectedProviders[provider]}
              onChange={(e) => {
                const updatedValue = e?.target?.checked
                setSelectedProviders((prevState) => ({
                  ...prevState,
                  [provider]: updatedValue,
                }))
              }}
            >
              {provider}
            </Checkbox>
          ))}
        </Stack>
      </FilterSection>

      <FilterSection title="Collateral">
        <Stack>
          {collaterals.map((collateral) => (
            <Checkbox
              isChecked={selectedCollateral[collateral]}
              onChange={(e) => {
                const updatedValue = e?.target?.checked
                setSelectedCollateral((prevState) => ({
                  ...prevState,
                  [collateral]: updatedValue,
                }))
              }}
            >
              {collateral}
            </Checkbox>
          ))}
        </Stack>
      </FilterSection>

      <FilterSection title="Reward">
        <Stack>
          {rewards.map((reward) => (
            <Checkbox
              isChecked={selectedRewards[reward]}
              onChange={(e) => {
                const updatedValue = e?.target?.checked
                setSelectedRewards((prevState) => ({
                  ...prevState,
                  [reward]: updatedValue,
                }))
              }}
            >
              <Text pl={2}>{reward}</Text>
            </Checkbox>
          ))}
        </Stack>
      </FilterSection>
    </Box>
  )
}

const FilterSection: React.FC<{ title: string }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box py={1}>
      <Button
        rightIcon={isOpen ? 'minus' : 'add'}
        variant="ghost"
        w="100%"
        d="flex"
        justifyContent="space-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text fontWeight="medium">{title}</Text>
      </Button>
      <Collapse startingHeight={0} isOpen={isOpen} px={4} py={2}>
        {children}
      </Collapse>
    </Box>
  )
}

const objectToDefaultsReducer = (acc, key) => ({ ...acc, [key]: false })

const underMaxRisk = (itemRiskLevel: RiskLevel, maxRiskLevel: RiskLevel) => {
  const riskLevels = [
    RiskLevel.NONE,
    RiskLevel.LOW,
    RiskLevel.MEDIUM,
    RiskLevel.HIGH,
  ]
  return riskLevels.indexOf(itemRiskLevel) <= riskLevels.indexOf(maxRiskLevel)
}
