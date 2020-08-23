import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Collapse,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
  Tag,
} from '@chakra-ui/core'
import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { pools } from '../utils/pool-data'
import { RiskLevel, riskBlurbs, toNumber } from '../utils/utils'

enum SortOrder {
  Lowest,
  Highest,
  Newest,
  Oldest,
  Provider,
}

enum Filters {
  ShowLowApr,
  ShowLowLiquidity,
  OnlyMyPools,
  OnlyMyRewards,
}

const TextMenuButton: React.FC<MenuButtonProps & ButtonProps> = ({
  children,
  ...props
}) => <MenuButton {...props}>{children}</MenuButton>

const poolData = []

export const PoolSection: React.FC<{ ethApp: any }> = ({ ethApp }) => {
  const [visiblePools, setVisiblePools] = useState([])
  const [sortOrder, setSortOrder] = useState(SortOrder.Highest)
  const [filters, setFilters] = useState([])

  const sortByApr = (a, b) => {
    if (sortOrder === SortOrder.Highest) {
      return parseFloat(b.apr) - parseFloat(a.apr)
    } else {
      return parseFloat(a.apr) - parseFloat(b.apr)
    }
  }

  const updateVisiblePools = () => {
    let pools = poolData

    if (pools.length < 1) {
      return
    }
    if (filters.includes(Filters.OnlyMyPools)) {
      pools = pools.filter((item) => toNumber(item?.staking[1]?.value) > 0)
    }

    if (filters.includes(Filters.OnlyMyRewards)) {
      pools = pools.filter(
        (item) =>
          item?.rewards?.length > 0 && toNumber(item?.rewards[0]?.value) > 0
      )
    }

    if (!filters.includes(Filters.ShowLowApr)) {
      pools = pools.filter((item) => toNumber(item?.apr) > 2)
    }

    if (!filters.includes(Filters.ShowLowLiquidity)) {
      pools = pools.filter(
        (item) =>
          !item?.staking[0]?.value ||
          parseFloat(
            item?.staking[0]?.value.replace('$', '').replaceAll(',', '') || '0'
          ) > 200000
      )
    }

    if (sortOrder === SortOrder.Highest || sortOrder === SortOrder.Lowest) {
      pools.sort(sortByApr)
    } else if (sortOrder === SortOrder.Newest) {
      pools.reverse()
    } else if (sortOrder === SortOrder.Provider) {
      pools.sort((a, b) => a.provider.localeCompare(b.provider))
    }

    setVisiblePools([...pools])
  }

  const getPoolInfo = async () => {
    if (ethApp) {
      await Promise.all(
        Object.values(pools).map((getPoolData) =>
          (getPoolData(ethApp) as any)
            .then((data) => poolData.push(data))
            .catch((e) => console.error(e))
        )
      )
      updateVisiblePools()
    }
  }

  useEffect(() => {
    getPoolInfo()
  }, [ethApp])

  useEffect(() => {
    updateVisiblePools()
  }, [sortOrder, filters])

  return (
    <Box pt={4}>
      <Box>
        <Flex justifyContent="space-between" mx="1rem">
          <Text
            w="25%"
            d={{ xs: 'none', md: 'block' }}
            color="gray.600"
            fontWeight="bold"
            ml="16px"
          >
            Provider
          </Text>
          <Text ml="8px" w="25%" color="gray.600" fontWeight="bold">
            Pool
          </Text>
          <Text w="25%" color="gray.600" fontWeight="bold">
            Rewards
          </Text>
          <Text w="25%" color="gray.600" fontWeight="bold">
            APR
          </Text>
          <Menu closeOnSelect={false}>
            <TextMenuButton
              as={Button}
              variant="unstyled"
              maxH="24px"
              rightIcon="chevron-down"
              color="gray.600"
              fontWeight="bold"
              mr={11}
              isDisabled={visiblePools.length < 1}
            >
              <Box d={{ xs: 'none', md: 'inline' }}>Filter</Box>
            </TextMenuButton>
            <MenuList>
              <MenuOptionGroup
                value={sortOrder}
                defaultValue={SortOrder.Highest}
                onChange={(value) => setSortOrder(value)}
                title="Sort"
                type="radio"
              >
                <MenuItemOption value={SortOrder.Highest}>
                  Highest APR
                </MenuItemOption>
                <MenuItemOption value={SortOrder.Lowest}>
                  Lowest APR
                </MenuItemOption>
                {/* <MenuItemOption value={SortOrder.Newest}>
                  Newest First
                </MenuItemOption>
                <MenuItemOption value={SortOrder.Oldest}>
                  Oldest First
                </MenuItemOption> */}
                <MenuItemOption value={SortOrder.Provider}>
                  By Provider
                </MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup
                onChange={(value) => setFilters(value)}
                value={filters}
                title="Filters"
                type="checkbox"
              >
                <MenuItemOption value={Filters.OnlyMyPools}>
                  Only show pools I'm in
                </MenuItemOption>
                <MenuItemOption value={Filters.OnlyMyRewards}>
                  Only show pools I have rewards in
                </MenuItemOption>
                <MenuItemOption value={Filters.ShowLowApr}>
                  Show pools with low APR
                </MenuItemOption>
                <MenuItemOption value={Filters.ShowLowLiquidity}>
                  Show pools with low liquidity
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
        <Box mx="1rem">
          {visiblePools.length > 0
            ? visiblePools.map((poolItemData) => (
                <PoolItem key={poolItemData.name} poolItemData={poolItemData} />
              ))
            : !filters.includes(Filters.OnlyMyPools) && (
                <Box>
                  {[...Array(6)].map((_e, i) => (
                    <Skeleton height={72} my={4} width="100%" key={i} />
                  ))}
                </Box>
              )}
        </Box>
      </Box>
    </Box>
  )
}

const PoolItem = ({ poolItemData }) => {
  const { provider, name, poolRewards } = poolItemData
  const [show, setShow] = useState(false)

  return (
    <Card boxShadow="sm" mx={0}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setShow(!show)}
        cursor="pointer"
      >
        <Text d={{ xs: 'none', md: 'block' }} w="25%">
          {provider}
        </Text>
        <Text w="25%">{name}</Text>
        <Box w="25%">
          {poolRewards.map((reward) => (
            <Badge mx={1} key={reward}>
              {reward}
            </Badge>
          ))}
        </Box>
        <Text w="25%">
          {poolItemData.apr ? (
            `${poolItemData.apr}%`
          ) : (
            <Skeleton height="20px" maxW={20} />
          )}
        </Text>
        <IconButton
          backgroundColor="white"
          fontSize={20}
          onClick={() => setShow(!show)}
          isRound={true}
          aria-label="Show more"
          icon={show ? 'chevron-up' : 'chevron-down'}
        >
          More Info
        </IconButton>
      </Flex>
      <Collapse mt={4} isOpen={show}>
        <Divider mb={4} />
        <SimpleGrid minChildWidth="212px" spacing={4}>
          <LinkList links={poolItemData.links || []} />
          <DetailItem title="Prices" data={poolItemData.prices} />
          <DetailItem title="ROI" data={poolItemData.ROIs} />
          {poolItemData.staking?.length > 0 && (
            <DetailItem title="Staking" data={poolItemData.staking} />
          )}
          {poolItemData.rewards?.length > 0 && (
            <DetailItem title="Claimable Rewards" data={poolItemData.rewards} />
          )}
          {typeof poolItemData.risk !== 'undefined' && (
            <RiskList data={poolItemData.risk} />
          )}
        </SimpleGrid>
      </Collapse>
    </Card>
  )
}

const riskColors = {
  [RiskLevel.LOW]: 'green.400',
  [RiskLevel.MEDIUM]: 'yellow.300',
  [RiskLevel.HIGH]: 'red.500',
}

const RiskList = ({ data }) =>
  data ? (
    <Box>
      <Heading as="h4" size="sm" color="gray.600" pb={2}>
        Risk Levels
      </Heading>
      <Flex>
        <Box pr={5}>
          <Text pb=".1rem">Smart Contract Risk</Text>
          <Text pb=".1rem">Impermanent Loss Risk</Text>
        </Box>
        <Box>
          <Tooltip
            label={riskBlurbs.il[data.smartContract]}
            aria-label={riskBlurbs.il[data.smartContract]}
            bg="white"
            color="black"
            placement="right-end"
            pb=".1rem"
          >
            <Text
              fontWeight="medium"
              pb=".1rem"
              color={riskColors[data.smartContract]}
              cursor="default"
            >
              {data.smartContract}
            </Text>
          </Tooltip>
          <Tooltip
            label={riskBlurbs.il[data.impermanentLoss]}
            aria-label={riskBlurbs.il[data.impermanentLoss]}
            bg="white"
            color="black"
            placement="right-end"
            pb=".1rem"
          >
            <Text
              fontWeight="medium"
              pb=".1rem"
              color={riskColors[data.impermanentLoss]}
              cursor="default"
            >
              {data.impermanentLoss}
            </Text>
          </Tooltip>
        </Box>
      </Flex>
    </Box>
  ) : (
    <Box />
  )

const LinkList = ({ links }) => (
  <Box>
    <Heading as="h4" size="sm" color="gray.600" pb={2}>
      Links
    </Heading>
    {links.map(({ title, link }) => (
      <Link href={link} d="block" key={title} isExternal>
        {title}
      </Link>
    ))}
  </Box>
)

const DetailItem = ({ title, data }) =>
  data ? (
    <Box>
      <Heading as="h4" size="sm" color="gray.600" pb={2}>
        {title}
      </Heading>
      <Flex>
        <Box pr={5}>
          {data.map(({ label }) => (
            <Text fontWeight="bold" key={label} pb=".1rem">
              {label}
            </Text>
          ))}
        </Box>
        <Box>
          {data.map(({ value }, index) => (
            <Text pb=".1rem" key={index}>
              {value}
            </Text>
          ))}
        </Box>
      </Flex>
    </Box>
  ) : (
    <Box />
  )
