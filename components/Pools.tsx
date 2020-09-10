import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  Tooltip,
} from '@chakra-ui/core'
import { ChevronDownIcon, ChevronUpIcon, RepeatIcon } from '@chakra-ui/icons'
import constate from 'constate'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import CountUp from 'react-countup'
import { useEthContext } from '../contexts/ProviderContext'
import { LoadState, RiskLevel } from '../types'
import { getPools } from '../utils/pool-data'
import { toDollar, toNumber } from '../utils/utils'
import { Card } from './Card'
import { useFilterSidebarContext } from './FilterSidebar'
import { useWalletModalContext } from './Sidebar'
import { PLACEHOLDER_ADDRESS } from '../data/constants'

const usePools = () => {
  const { ethApp } = useEthContext()
  const [pools, setPools] = useState([])
  const [filteredPools, setFilteredPools] = useState([])
  const [expandAll, setExpandAll] = useState(false)
  const [expandAllStateChanged, setExpandAllStateChanged] = useState(0)
  const [loadState, setLoadState] = useState(LoadState.LOADED)
  const [totalWeeklyRoi, setTotalWeeklyRoi] = useState(0)
  const [poolPositions, setPoolPositions] = useState([])
  const [yourPoolGroupings, setYourPoolGroupings] = useState({})

  const expandOrCollapseAll = (value: boolean) => {
    setExpandAllStateChanged(expandAllStateChanged + 1)
    setExpandAll(value)
  }

  const getPoolInfo = async () => {
    if (ethApp && typeof window !== 'undefined') {
      setLoadState(LoadState.LOADING)

      const fetchedPools = []
      const yourPoolPositions = []
      let weeklyRoi = 0
      await Promise.all(
        Object.values(getPools).map(
          (getPoolData) =>
            new Promise((resolve) => {
              ;(getPoolData(ethApp) as any)
                .then((data) => {
                  fetchedPools.push(data)
                  if (data?.staking[1]?.value) {
                    if (data?.ROIs[2]?.value) {
                      const roi =
                        (toNumber(data.ROIs[2].value) *
                          toNumber(data.staking[1].value)) /
                        100
                      weeklyRoi += roi
                    }
                    if (toNumber(data?.staking[1]?.value) > 10) {
                      yourPoolPositions.push(data)
                    }
                  }
                  resolve()
                })
                .catch((e) => {
                  console.error(e)
                  resolve()
                })
            })
        )
      )

      const yourPools = yourPoolPositions.reduce((acc, item) => {
        const key = item.provider
        acc[key] = acc[key] || []
        acc[key].push(item)
        return acc
      }, {})

      setTotalWeeklyRoi(weeklyRoi)
      setPoolPositions(yourPoolPositions)
      setYourPoolGroupings(yourPools)
      setPools(fetchedPools)
      setLoadState(LoadState.LOADED)
    }
  }

  useMemo(() => getPoolInfo(), [ethApp])

  return {
    pools,
    setPools,
    filteredPools,
    setFilteredPools,
    expandAll,
    expandAllStateChanged,
    expandOrCollapseAll,
    loadState,
    setLoadState,
    totalWeeklyRoi,
    setTotalWeeklyRoi,
    poolPositions,
    setPoolPositions,
    getPoolInfo,
    yourPoolGroupings,
  }
}
export const [PoolProvider, usePoolContext] = constate(usePools)

export const PoolSection: React.FC<{ prefetchedPools: any }> = ({
  prefetchedPools,
}) => {
  const {
    pools,
    setPools,
    filteredPools,
    loadState,
    getPoolInfo,
  } = usePoolContext()
  const { onOpen } = useFilterSidebarContext()

  const sortByApr = (a, b) => parseFloat(b.apr) - parseFloat(a.apr)

  useEffect(() => {
    if (pools.length === 0) {
      setPools(prefetchedPools)
    }
  }, [prefetchedPools])

  return (
    <Box pt={4}>
      <Grid
        templateColumns={['1.5fr 1fr 1.2fr 0.2fr', '1fr 1.5fr 1.3fr 1fr 0.2fr']}
        marginX="2rem"
        marginBottom="0.3rem"
      >
        <Text
          d={{ xs: 'none', md: 'flex' }}
          color="gray.600"
          fontWeight="bold"
          alignItems="center"
        >
          Provider
        </Text>
        <Text
          color="gray.600"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          Pool
        </Text>
        <Text
          color="gray.600"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          Rewards
        </Text>
        <Text
          color="gray.600"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          APR
        </Text>
        <IconButton
          isLoading={loadState === LoadState.LOADING}
          onClick={getPoolInfo}
          aria-label="refresh"
          title="Refresh Pools"
          icon={<RepeatIcon />}
          variant="ghost"
          justifySelf="end"
          isRound={true}
        />
      </Grid>
      <Box mx="1rem">
        <Flex direction="column" justifyContent="center">
          {filteredPools.length > 0 ? (
            filteredPools
              ?.sort(sortByApr)
              ?.map((poolItemData, index) => (
                <PoolItem key={index} poolItemData={poolItemData} />
              ))
          ) : (
            <Card>
              <Text fontWeight="medium">
                No pools found using the selected criteria
              </Text>
            </Card>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

const PoolItem = ({ poolItemData }) => {
  const { provider, name, poolRewards } = poolItemData
  const [show, setShow] = useState(false)
  const { expandAll, expandAllStateChanged } = usePoolContext()

  useEffect(() => {
    setShow(expandAll)
  }, [expandAllStateChanged])

  return (
    <Card boxShadow="sm" mx={0} mt={0}>
      <Grid
        templateColumns={['1.5fr 1fr 1.2fr 0.2fr', '1fr 1.5fr 1.3fr 1fr 0.2fr']}
        onClick={() => setShow(!show)}
        cursor="pointer"
      >
        <Text d={{ xs: 'none', md: 'flex' }} alignItems="center">
          {provider}
        </Text>
        <Text display="flex" alignItems="center">
          {name}
        </Text>
        <Box display="flex" alignItems="center">
          {poolRewards.map((reward) => (
            <Badge mx={1} key={reward}>
              {reward}
            </Badge>
          ))}
        </Box>
        <Text display="flex" alignItems="center">
          {poolItemData.apr ? (
            `${poolItemData.apr}%`
          ) : (
            <Skeleton height="20px" maxW={20} />
          )}
        </Text>
        <IconButton
          backgroundColor="white"
          justifySelf="end"
          variant="ghost"
          fontSize={20}
          onClick={() => setShow(!show)}
          isRound={true}
          aria-label="Show more"
          icon={show ? <ChevronUpIcon /> : <ChevronDownIcon />}
        />
      </Grid>
      <Collapse mt={4} isOpen={show}>
        <Divider mb={4} />
        <SimpleGrid minChildWidth="212px" spacing={4} cursor="auto">
          <LinkList links={poolItemData.links || []} />
          <DetailItem title="Prices" data={poolItemData.prices} />
          <DetailItem title="ROI" data={poolItemData.ROIs} />
          {poolItemData.staking?.length > 0 && (
            <DetailItem title="Staking" data={poolItemData.staking} />
          )}
          {poolItemData?.rewards?.length > 0 && (
            <DetailItem
              title="Claimable Rewards"
              data={poolItemData?.rewards}
            />
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
  [RiskLevel.NONE]: 'green.400',
  [RiskLevel.LOW]: 'green.400',
  [RiskLevel.MEDIUM]: 'orange.300',
  [RiskLevel.HIGH]: 'red.500',
  [RiskLevel.EXTREME]: 'red.700',
}

const RiskList = ({ data }) =>
  data ? (
    <Box>
      <Heading as="h4" size="sm" color="gray.600" pb={2}>
        Risk Levels
      </Heading>
      <Flex>
        <Box pr={5}>
          <Text pb=".1rem">Smart Contract</Text>
          <Text pb=".1rem">Impermanent Loss</Text>
        </Box>
        <Box>
          <Tooltip
            label={riskBlurbs.sc[data.smartContract]}
            aria-label={riskBlurbs.sc[data.smartContract]}
            bg="white"
            color="black"
            placement="right-end"
            p=".5rem"
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
            p=".5rem"
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

const riskBlurbs = {
  il: {
    [RiskLevel.NONE]:
      'This contract is not a split pool, so there is no risk of impermanent loss.',
    [RiskLevel.MEDIUM]:
      'This is a unevenly split pool, impermanent loss can occur.',
    [RiskLevel.HIGH]: 'This is a split pool, impermanent loss can occur.',
  },
  sc: {
    [RiskLevel.LOW]: 'This smart contract has been professionally audited.',
    [RiskLevel.MEDIUM]:
      'This smart contract is based on a tested contract, but has not been audited.',
    [RiskLevel.HIGH]:
      'This smart contract is unaudited and experimental. Use at your own risk.',
  },
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

const DetailItem = ({ title, data, totalValue = '' }) =>
  data && data.length > 0 ? (
    <Box>
      <Heading as="h4" size="sm" color="gray.600" pb={2}>
        {title}
      </Heading>
      <Flex>
        <Grid templateColumns="repeat(2, 1fr)" rowGap={1} columnGap={4}>
          {data.map(({ label, value }) => (
            <>
              <Text fontWeight="bold" key={label} pb=".1rem">
                {label}
              </Text>
              <Text key={value} pb=".1rem">
                {value}
              </Text>
            </>
          ))}
        </Grid>
      </Flex>
    </Box>
  ) : null

export const EarningsSection = ({ ...props }) => {
  const { totalWeeklyRoi, poolPositions, yourPoolGroupings } = usePoolContext()
  const [roiView, setRoiView] = useState(0)

  const toggleRoi = () => {
    if (roiView === 2) {
      setRoiView(0)
    } else {
      setRoiView(roiView + 1)
    }
  }

  // const combinedRewards = Object.keys(yourPoolGroupings).map(poolProvider => {
  //   const rewardList
  //   return {provider: poolProvider}
  // })

  const totalClaimableRewards = poolPositions?.reduce(
    (total, item) =>
      total +
      (item?.rewards?.length > 0 ? toNumber(item?.rewards[0]?.value) : 0),
    0
  )
  const totalPoolPositions = poolPositions?.reduce(
    (total, item) => total + toNumber(item?.staking[1]?.value),
    0
  )
  const rois = [
    {
      label: 'Hourly',
      value: toDollar(totalWeeklyRoi / 7 / 24),
      text: 'Per Hour',
    },
    {
      label: 'Daily',
      value: toDollar(totalWeeklyRoi / 7),
      text: 'Per Day',
    },
    {
      label: 'Weekly',
      value: toDollar(totalWeeklyRoi),
      text: 'Per Week',
    },
  ]
  return totalWeeklyRoi > 0 || poolPositions.length > 0 ? (
    <Box pt={1} pb={[8, 8, 8, 2]} mx="1rem" {...props}>
      <SimpleGrid columns={[0, 0, 3]} spacing={[1, 1, 12]}>
        <Flex flexDir="column">
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl={1}>
            Estimated Earnings
          </Text>
          <Card h="100%" w="100%" m={0} mt={2}>
            <Box onClick={toggleRoi} cursor="pointer">
              <Stat>
                <StatNumber>
                  <CountUp
                    end={toNumber(rois[roiView].value)}
                    decimals={2}
                    separator=","
                    prefix="$"
                  />
                </StatNumber>
                <StatHelpText>{rois[roiView].text}</StatHelpText>
              </Stat>
            </Box>
            <DetailItem title="" data={rois} />
          </Card>
        </Flex>
        <Flex flexDir="column">
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl={1}>
            Claimable Rewards
          </Text>
          <Card h="100%" w="100%" m={0} mt={2} rounded={20}>
            <Box pb={1}>
              <Stat>
                <StatNumber>
                  <CountUp
                    end={totalClaimableRewards}
                    decimals={2}
                    separator=","
                    prefix="$"
                  />
                </StatNumber>
                <StatHelpText>Total Claimable</StatHelpText>
              </Stat>
            </Box>
            <ClaimableList yourPoolGroupings={yourPoolGroupings} />
          </Card>
        </Flex>
        <Flex flexDir="column">
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl={1}>
            Pool Positions
          </Text>
          <Card h="100%" w="100%" m={0} mt={2} rounded={20}>
            <Stat>
              <StatNumber>
                <CountUp
                  end={totalPoolPositions}
                  decimals={2}
                  separator=","
                  prefix="$"
                />
              </StatNumber>
              <StatHelpText>Total Pooled</StatHelpText>
            </Stat>
            <RewardList yourPoolGroupings={yourPoolGroupings} />
          </Card>
        </Flex>
      </SimpleGrid>
    </Box>
  ) : null
}

export const YourPools: React.FC = () => {
  const [yourPools, setYourPools] = useState([])
  const { getPoolInfo, loadState, pools } = usePoolContext()
  const router = useRouter()
  const { onOpen } = useWalletModalContext()
  const { ethApp } = useEthContext()

  useEffect(() => {
    const filteredPools = pools.filter(
      (item) =>
        toNumber(item?.staking[1]?.value) > 5 ||
        (item?.rewards?.length > 0 && toNumber(item?.rewards[0]?.value) > 10)
    )
    setYourPools(filteredPools)
  }, [pools])

  const sortByApr = (a, b) => parseFloat(b.apr) - parseFloat(a.apr)

  if (
    !ethApp?.YOUR_ADDRESS ||
    ethApp?.YOUR_ADDRESS === PLACEHOLDER_ADDRESS ||
    (loadState === LoadState.LOADED && yourPools.length <= 0)
  ) {
    return (
      <Flex alignItems="center" justifyContent="center" pt={100}>
        <Box>
          <Text as="h2" fontSize="2xl" fontWeight="medium" pb={2}>
            Connect an Ethereum wallet to see your yield farming dashboard.
          </Text>
          <Text as="h3" fontSize="xl" color="gray.600" fontWeight="medium">
            Or view pools to find the best opportunities.
          </Text>
          <Stack isInline spacing={3} pt={6}>
            <Button colorScheme="teal" onClick={onOpen}>
              Connect Wallet
            </Button>
            <Text d="flex" alignItems="center">
              or
            </Text>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                router.push('/pools')
              }}
            >
              View pools
            </Button>
          </Stack>
        </Box>
      </Flex>
    )
  }
  return yourPools.length > 0 ? (
    <Box>
      <EarningsSection />

      <Box pt={{ xs: 1, lg: 4 }}>
        <Grid
          templateColumns={[
            '1.5fr 1fr 1.2fr 0.2fr',
            '1fr 1.5fr 1.3fr 1fr 0.2fr',
          ]}
          marginX="2rem"
          marginBottom="0.3rem"
        >
          <Text
            d={{ xs: 'none', md: 'flex' }}
            color="gray.600"
            fontWeight="bold"
            alignItems="center"
          >
            Provider
          </Text>
          <Text
            color="gray.600"
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            Pool
          </Text>
          <Text
            color="gray.600"
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            Rewards
          </Text>
          <Text
            color="gray.600"
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            APR
          </Text>
          <IconButton
            isLoading={loadState === LoadState.LOADING}
            onClick={getPoolInfo}
            aria-label="refresh"
            title="Refresh Pools"
            icon={<RepeatIcon />}
            variant="ghost"
            justifySelf="end"
            isRound={true}
          />
        </Grid>
        <Box mx="1rem">
          <Flex direction="column" justifyContent="center">
            {yourPools?.sort(sortByApr)?.map((poolItemData, index) => (
              <PoolItem key={index} poolItemData={poolItemData} />
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  ) : (
    <Flex justifyContent="center" py={20}>
      <Spinner thickness="4px" speed="0.65s" color="teal.500" size="xl" />
    </Flex>
  )
}

const RewardList = ({ yourPoolGroupings }) =>
  yourPoolGroupings ? (
    <Box maxW={350} pt={1}>
      <Grid templateColumns="repeat(2, fit-content(8ch))" columnGap={4}>
        {Object.keys(yourPoolGroupings).map((provider) => (
          <>
            <Text color="gray.600" fontWeight="bold">
              {provider}
            </Text>
            <Box></Box>
            {yourPoolGroupings[provider].map((poolItem) => (
              <>
                <Text
                  fontWeight="bold"
                  key={poolItem.name}
                  pb={2}
                  whiteSpace="nowrap"
                >
                  {poolItem.name}
                </Text>
                <Text key={poolItem.name + '-val'}>
                  {poolItem.staking[1].value}
                </Text>
              </>
            ))}
          </>
        ))}
      </Grid>
    </Box>
  ) : null

const ClaimableList = ({ yourPoolGroupings, ...props }) =>
  yourPoolGroupings ? (
    <Box maxW={350} {...props}>
      <Grid templateColumns="repeat(2, fit-content(8ch))" columnGap={4}>
        {Object.keys(yourPoolGroupings).map((provider) =>
          yourPoolGroupings[provider][0] &&
          yourPoolGroupings[provider][0]?.rewards &&
          yourPoolGroupings[provider][0]?.rewards.length > 0 ? (
            <>
              <Text color="gray.600" fontWeight="bold">
                {provider}
              </Text>
              <Box></Box>
              {yourPoolGroupings[provider].map((poolItem) =>
                poolItem &&
                poolItem?.rewards &&
                poolItem?.rewards.length > 0 ? (
                  <>
                    <Text
                      fontWeight="bold"
                      key={poolItem.name}
                      pb={2}
                      whiteSpace="nowrap"
                    >
                      {poolItem?.rewards[0]?.label}
                    </Text>
                    <Text key={poolItem.name + '-val'}>
                      {poolItem?.rewards[0]?.value}
                    </Text>
                  </>
                ) : null
              )}
            </>
          ) : null
        )}
      </Grid>
    </Box>
  ) : null
