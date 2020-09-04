import { Box, Flex, Text } from '@chakra-ui/core'
import { Card } from '../components/Card'
import { Filters } from '../components/Filters'
import {
  FilterDrawer,
  FilterSidebarProvider,
} from '../components/FilterSidebar'
import { PoolSection } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import { initInfuraServer } from '../hooks/useEthers'
import { graphcms, linkSectionContents } from '../services/graph-cms-service'
import { getPools } from '../utils/pool-data'

export default ({ informationSection, toolSection, poolData }) => (
  <FilterSidebarProvider>
    <Flex direction={{ xs: 'column', lg: 'row' }} pb="1rem">
      <Box width={{ xs: '100%', lg: '70%' }}>
        <PoolSection prefetchedPools={poolData} />
      </Box>
      <Box flexGrow={1} pt=".5rem">
        <Box d={{ xs: 'none', lg: 'block' }}>
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
            Filters
          </Text>
          <Card>
            <Filters />
          </Card>
        </Box>
        <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
          Information
        </Text>
        <ResourceCard pt={0} title="" sectionContent={informationSection} />
        <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
          Tools
        </Text>
        <ResourceCard pt={0} title="" sectionContent={toolSection} />
      </Box>
    </Flex>
    <FilterDrawer />
  </FilterSidebarProvider>
)

export const getStaticProps = async () => {
  const sectionData = await graphcms.request(
    `
    {
      informationSection: infoLinks(where: {section: info}) {
        ${linkSectionContents}
      }
      toolSection: infoLinks(where: {section: tools}) {
        ${linkSectionContents}
      }
    }
    `
  )

  const poolData = await prerenderPoolData()

  return {
    revalidate: 300,
    props: { ...sectionData, poolData: JSON.parse(JSON.stringify(poolData)) },
  }
}

const prerenderPoolData = async () => {
  return []
  const ethApp = await initInfuraServer()
  if (ethApp) {
    const fetchedPools = []
    await Promise.all(
      Object.values(getPools).map(
        (getPoolData) =>
          new Promise((resolve) => {
            ;(getPoolData(ethApp) as any)
              .then((data) => {
                fetchedPools.push(data)
                resolve()
              })
              .catch((e) => {
                console.error(e)
                resolve()
              })
          })
      )
    )
    return fetchedPools
  }
}
