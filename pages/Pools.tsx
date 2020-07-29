import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Collapse,
  Text,
  Flex,
  IconButton,
  Heading,
  SimpleGrid,
} from '@chakra-ui/core'
import { getPoolData } from './utils/pool-data'
import { Card } from '../components/Card'

const get = () => {
  console.log('get pool data!!')
  getPoolData.susd()
}

type PoolData = {
  icon?: string
  name: string
  provider: string
  poolItems: Array<String>
  poolRewards: Array<String>
  getPoolData: Function
}

const poolDataList: Array<PoolData> = [
  {
    provider: 'Synthetix',
    name: 'Curve sUSD',
    poolItems: [''],
    poolRewards: ['SNX', 'CRV'],
    getPoolData: () => 200,
  },
  {
    provider: 'Synthetix',
    name: 'Synthetix iETH',
    poolItems: [''],
    poolRewards: ['SNX'],
    getPoolData: () => 200,
  },
  {
    provider: 'Synthetix',
    name: 'Synthetix iBTC',
    poolItems: [''],
    poolRewards: ['SNX'],
    getPoolData: () => 200,
  },
  {
    provider: 'Synthetix & Ren',
    name: 'Curve sBTC',
    poolItems: [''],
    poolRewards: ['SNX', 'CRV', 'REN', 'BAL'],
    getPoolData: () => 200,
  },
  {
    provider: 'yearn.finance',
    name: 'Curve yCRV',
    poolItems: [''],
    poolRewards: ['YFI', 'CRV'],
    getPoolData: () => 200,
  },
  {
    provider: 'yearn.finance',
    name: 'Balancer YFI-DAI',
    poolItems: [''],
    poolRewards: ['YFI', 'BAL'],
    getPoolData: () => 200,
  },
  {
    provider: 'yearn.finance',
    name: 'Balancer YFI-yCRV',
    poolItems: [''],
    poolRewards: ['YFI', 'CRV', 'BAL', 'yCRV'],
    getPoolData: () => 200,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-USDC',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: () => 200,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-WETH',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: () => 200,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-MTA',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: () => 200,
  },
  {
    provider: 'UMA Project',
    name: 'Balancer yUSD-USDC',
    poolItems: [''],
    poolRewards: ['UMA', 'BAL'],
    getPoolData: () => 200,
  },
]

const PoolsList = (props) => (
  <Box pt={4}>
    <Box>
      <Flex justifyContent="space-between" px={8}>
        <Text
          w="25%"
          d={{ xs: 'none', md: 'block' }}
          color="gray.600"
          fontWeight="bold"
        >
          Provider
        </Text>
        <Text w="25%" color="gray.600" fontWeight="bold">
          Pool
        </Text>
        <Text w="25%" color="gray.600" fontWeight="bold">
          Rewards
        </Text>
        <Text w="30%" color="gray.600" fontWeight="bold">
          APR
        </Text>
        <Text> </Text>
      </Flex>
      <Box>
        {poolDataList.map((poolItemData) => (
          <PoolItem poolItemData={poolItemData} />
        ))}
      </Box>
    </Box>
    {/* {get()} */}
  </Box>
)

const PoolItem = ({ poolItemData }) => {
  console.log('PoolItem:React.FC -> poolItemData', poolItemData)
  const { provider, name, poolItems, poolRewards, getPoolData } = poolItemData
  const [show, setShow] = useState(false)
  const [apr, setApr] = useState()

  useEffect(() => {
    ;(async () => {
      const poolApr = await getPoolData()
      setApr(poolApr)
    })()
  }, [])

  return (
    <Card boxShadow="sm">
      <Flex justifyContent="space-between" alignItems="center">
        <Text d={{ xs: 'none', md: 'block' }} w="25%">
          {provider}
        </Text>
        <Text w="25%">{name}</Text>
        <Box w="25%">
          {poolRewards.map((reward) => (
            <Badge mx={1}>{reward}</Badge>
          ))}
        </Box>
        <Text w="25%">{apr}%</Text>
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
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </Collapse>
    </Card>
  )
}

export default PoolsList
