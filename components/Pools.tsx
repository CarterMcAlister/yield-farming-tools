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
} from '@chakra-ui/core'
import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import poolDataList from './poolData'

enum SortOrder {
  Lowest,
  Highest,
  Newest,
  Oldest,
  Provider,
}

enum Filters {
  ShowLowApr,
  OnlyMyPools,
}

const TextMenuButton: React.FC<MenuButtonProps & ButtonProps> = ({
  children,
  ...props
}) => <MenuButton {...props}>{children}</MenuButton>

export const PoolSection: React.FC<{ ethApp: any }> = ({ ethApp }) => {
  const [visiblePools, setVisiblePools] = useState([])
  const [sortOrder, setSortOrder] = useState(SortOrder.Highest)
  const [filters, setFilters] = useState([])

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
        (item) =>
          parseFloat(
            item?.poolData?.staking[1]?.value?.replace('$', '') || '0'
          ) > 0
      )
    }
    if (!filters.includes(Filters.ShowLowApr)) {
      pools = pools.filter((item) => parseFloat(item?.poolData?.apr || '0') > 2)
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
                <MenuItemOption value={SortOrder.Newest}>
                  Newest First
                </MenuItemOption>
                <MenuItemOption value={SortOrder.Oldest}>
                  Oldest First
                </MenuItemOption>
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
