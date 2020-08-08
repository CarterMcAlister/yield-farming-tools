import {
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/core'
import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import getPoolData from '../utils/pool-data'
import { initEthers } from '../utils/utils'

interface PoolDataType {
  apr?: string
  [key: string]: unknown
}

type PoolData = {
  icon?: string
  name: string
  provider: string
  poolData: PoolDataType
  poolRewards: Array<String>
  getPoolData: Function
}

enum SortOrder {
  Lowest,
  Highest,
  Newest,
  Oldest,
}

enum Filters {
  ShowLowApr,
  OnlyMyPools,
}

const poolDataList: Array<PoolData> = [
  {
    provider: 'Synthetix',
    name: 'Curve sUSD',
    poolData: {},
    poolRewards: ['SNX', 'CRV'],
    getPoolData: getPoolData.susd,
  },
  // {
  //   provider: 'Synthetix',
  //   name: 'Synthetix iETH',
  //   poolData: {},
  //   poolRewards: ['SNX'],
  //   getPoolData: getPoolData.ieth,
  // },
  {
    provider: 'Synthetix',
    name: 'Synthetix iBTC',
    poolData: {},
    poolRewards: ['SNX'],
    getPoolData: getPoolData.ibtc,
  },
  {
    provider: 'Synthetix & Ren',
    name: 'Curve sBTC',
    poolData: {},
    poolRewards: ['SNX', 'CRV', 'REN', 'BAL'],
    getPoolData: getPoolData.sbtc,
  },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Curve yCRV',
  //   poolData: {},
  //   poolRewards: ['YFI', 'CRV'],
  //   getPoolData: getPoolData.ygov_ycrv,
  // },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Balancer YFI-DAI',
  //   poolData: {},
  //   poolRewards: ['YFI', 'BAL'],
  //   getPoolData: getPoolData.ygov_balancer,
  // },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Balancer YFI-yCRV',
  //   poolData: {},
  //   poolRewards: ['YFI', 'CRV', 'BAL', 'yCRV'],
  //   getPoolData: getPoolData.ygov_ycrv_balancer,
  // },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-USDC',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_usdc,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-WETH',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_weth,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-MTA',
    poolData: {},
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_mta,
  },
  {
    provider: 'UMA Project',
    name: 'Balancer yUSD-USDC',
    poolData: {},
    poolRewards: ['UMA', 'BAL'],
    getPoolData: getPoolData.yusd_usdc,
  },
  {
    provider: 'yfii.finance',
    name: 'Curve yCRV 1',
    poolData: {},
    poolRewards: ['YFII', 'CRV'],
    getPoolData: getPoolData.yfii_ycrv,
  },
  {
    provider: 'yfii.finance',
    name: 'Balancer YFII-DAI',
    poolData: {},
    poolRewards: ['YFII', 'BAL'],
    getPoolData: getPoolData.yfii_dai,
  },
  {
    provider: 'yffi.finance',
    name: 'Curve yCRV',
    poolData: {},
    poolRewards: ['YFFI', 'CRV'],
    getPoolData: getPoolData.yffi,
  },
  {
    provider: 'yffi.finance',
    name: 'Balancer YFFI-DAI',
    poolData: {},
    poolRewards: ['YFFI', 'BAL'],
    getPoolData: getPoolData.yffi_dai,
  },
  {
    provider: 'yffi.finance',
    name: 'Balancer YFFI-yCRV',
    poolData: {},
    poolRewards: ['YFFI', 'CRV', 'BAL'],
    getPoolData: getPoolData.yffi_ycrv,
  },
  {
    provider: 'dForce',
    name: 'Uniswap GOLDx-USDx',
    poolData: {},
    poolRewards: ['DF'],
    getPoolData: getPoolData.goldx_usdx,
  },
  {
    provider: 'dForce',
    name: 'Uniswap DF-USDx',
    poolData: {},
    poolRewards: ['DF'],
    getPoolData: getPoolData.df_usdx,
  },
]

export const PoolSection = (props) => {
  const [ethApp, setEthApp] = useState(null)
  const [appError, setAppError] = useState(false)
  const [visiblePools, setVisiblePools] = useState([])
  const [sortOrder, setSortOrder] = useState(SortOrder.Highest)
  const [filters, setFilters] = useState([])

  const connectToWallet = async () => {
    try {
      const app = await initEthers()
      setEthApp(app)
    } catch (e) {
      console.error(e)
      setAppError(true)
    }
  }

  const sortByApr = (a, b) => {
    if (sortOrder === SortOrder.Highest) {
      return parseFloat(b.poolData.apr) - parseFloat(a.poolData.apr)
    } else {
      return parseFloat(a.poolData.apr) - parseFloat(b.poolData.apr)
    }
  }

  const updateVisiblePools = () => {
    let pools = poolDataList

    if (filters.includes(Filters.OnlyMyPools)) {
      pools = pools.filter(
        (item) => parseFloat(item?.poolData?.staking[1]?.value) > 0
      )
    }
    if (!filters.includes(Filters.ShowLowApr)) {
      pools = pools.filter((item) => parseFloat(item?.poolData?.apr) > 2)
    }

    if (sortOrder === SortOrder.Highest || sortOrder === SortOrder.Lowest) {
      pools.sort(sortByApr)
    } else if (sortOrder === SortOrder.Newest) {
      pools.reverse()
    }

    setVisiblePools([...pools])
  }

  const getPoolInfo = async () => {
    if (ethApp) {
      await Promise.all(
        poolDataList.map((poolItem) =>
          poolItem
            .getPoolData(ethApp)
            .then((data) => (poolItem.poolData = data))
            .catch((e) => (poolItem.poolData.apr = '0'))
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

  useEffect(() => {
    ;(async () => {
      await connectToWallet()
    })()
  }, [])

  return ethApp ? (
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
          <Text ml="16px" w="25%" color="gray.600" fontWeight="bold">
            Pool
          </Text>
          <Text w="25%" color="gray.600" fontWeight="bold">
            Rewards
          </Text>
          <Text w="25%" color="gray.600" fontWeight="bold">
            APR
          </Text>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              variant="unstyled"
              maxH="24px"
              rightIcon="chevron-down"
              color="gray.600"
              fontWeight="bold"
              mr={11}
            >
              <Box d={{ xs: 'none', md: 'inline' }}>Filter</Box>
            </MenuButton>
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
                <MenuItemOption value={SortOrder.Newest}>
                  Newest First
                </MenuItemOption>
                <MenuItemOption value={SortOrder.Oldest}>
                  Oldest First
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
                <MenuItemOption value={Filters.ShowLowApr}>
                  Show pools with low APR
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
  ) : (
    <Card
      maxW={{ xs: '100%', lg: 400 }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {appError && (
        <Alert status="error" maxW={400} mb={3}>
          <AlertIcon />
          <AlertTitle mr={2}>Web3 compatible browser required!</AlertTitle>
        </Alert>
      )}
      <Text fontWeight="bold" pb={3}>
        Connect your wallet to view pools
      </Text>
      <Button onClick={connectToWallet} variantColor="teal">
        Connect Wallet
      </Button>
    </Card>
  )
}

const PoolItem = ({ poolItemData }) => {
  const { provider, name, poolData, poolRewards } = poolItemData
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
          {poolData.apr ? (
            `${poolData.apr}%`
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
          <LinkList links={poolData.links || []} />
          <DetailItem title="Prices" data={poolData.prices} />
          <DetailItem title="ROI" data={poolData.ROIs} />
          <DetailItem title="Staking" data={poolData.staking} />
          {poolData.rewards?.length > 0 && (
            <DetailItem title="Claimable Rewards" data={poolData.rewards} />
          )}
        </SimpleGrid>
      </Collapse>
    </Card>
  )
}

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
