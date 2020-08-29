import {
  Box,
  Select,
  FormControl,
  FormLabel,
  Heading,
  Divider,
  Stack,
  Checkbox,
  Button,
  Menu,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  MenuButtonProps,
  ButtonProps,
  MenuButton,
  Collapse,
} from '@chakra-ui/core'
import React, { useState, useEffect } from 'react'
import { Card } from './Card'
import { SortOrder, FilterOptions } from '../types'
import { usePoolContext } from './Pools'

const TextMenuButton: React.FC<MenuButtonProps & ButtonProps> = ({
  children,
  ...props
}) => <MenuButton {...props}>{children}</MenuButton>

export const Filters = () => {
  const { pools, setPools, filteredPools, setFilteredPools } = usePoolContext()
  const [showAllCollateral, setShowAllCollateral] = useState(false)
  const [showAllRewards, setShowAllRewards] = useState(false)
  const [collaterals, setCollaterals] = React.useState([])
  const [rewards, setRewards] = React.useState([])

  const getCollateralAndRewardItems = () => {
    console.log('get')
    const collateralItems = []
    const rewardItems = []
    pools.map((item) => {
      item.prices.map((priceItem) => {
        if (priceItem?.label && !collateralItems?.includes(priceItem?.label)) {
          collateralItems.push(priceItem.label)
        }
      })
      item.poolRewards.map((rewardItem) => {
        if (rewardItem && !rewardItems?.includes(rewardItem)) {
          rewardItems.push(rewardItem)
        }
      })
    })
    setCollaterals(collateralItems)
    setRewards(rewardItems)
  }

  useEffect(() => getCollateralAndRewardItems(), [pools])

  return (
    <Card>
      <Stack isInline>
        <Button>Expand All</Button>
        <Button>Collapse All</Button>
      </Stack>
      <Divider />
      <Heading size="md">Risk Levels</Heading>
      <FormControl>
        <FormLabel htmlFor="maximumSCRisk">
          Maximum Smart Contract Risk
        </FormLabel>
        <Select id="maximumSCRisk" placeholder="Choose a risk level">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="maximumILRisk">
          Maximum Impermanent Loss Risk
        </FormLabel>
        <Select id="maximumILRisk" placeholder="Choose a risk level">
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </FormControl>
      <Divider />
      <Heading size="md">My Pools</Heading>
      <Stack>
        <Checkbox>Pools I'm in</Checkbox>
        <Checkbox>Pools I have rewards in</Checkbox>
        <Checkbox>Show pools with low APR</Checkbox>
        <Checkbox>Show pools with low liquidity</Checkbox>
      </Stack>
      <Divider />
      <Heading size="md">Filter by collateral</Heading>
      <Collapse startingHeight={280} isOpen={showAllCollateral}>
        <Stack>
          {collaterals.map((collateral) => (
            <Checkbox value={collateral}>{collateral}</Checkbox>
          ))}
        </Stack>
      </Collapse>
      <Button
        mt={showAllCollateral ? 0 : 2}
        size="sm"
        bg="white"
        leftIcon={showAllCollateral ? 'chevron-up' : 'chevron-down'}
        onClick={() => setShowAllCollateral(!showAllCollateral)}
      >
        Show {showAllCollateral ? 'Less' : 'More'}
      </Button>

      <Divider />
      <Heading size="md">Filter by reward</Heading>
      <Collapse startingHeight={280} isOpen={showAllRewards}>
        <Stack>
          {rewards.map((reward) => (
            <Checkbox value={reward}>{reward}</Checkbox>
          ))}
        </Stack>
      </Collapse>
      <Button
        mt={showAllRewards ? 0 : 2}
        size="sm"
        bg="white"
        leftIcon={showAllRewards ? 'chevron-up' : 'chevron-down'}
        onClick={() => setShowAllRewards(!showAllRewards)}
      >
        Show {showAllRewards ? 'Less' : 'More'}
      </Button>
    </Card>
  )
}
