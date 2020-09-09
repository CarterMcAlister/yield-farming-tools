import { Box, Flex, Text, Button } from '@chakra-ui/core'
import { Card } from '../components/Card'
import { Filters } from '../components/Filters'
import {
  FilterDrawer,
  FilterSidebarProvider,
} from '../components/FilterSidebar'
import { PoolSection } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import { SectionHeading } from '../components/SectionHeading'
import { initInfuraServer } from '../hooks/useEthers'
import { graphcms, linkSectionContents } from '../services/graph-cms-service'
import { getPools } from '../utils/pool-data'
import { FiFilter } from 'react-icons/fi'
import { useFilterSidebarContext } from '../components/FilterSidebar'

export default ({ informationSection, toolSection, poolData }) => {
  const { onOpen } = useFilterSidebarContext()
  return (
    <Box>
      <SectionHeading title="Pools">
        <Button
          onClick={onOpen}
          d={{ xs: 'flex', lg: 'none' }}
          marginLeft="1rem"
          marginBottom="1rem"
          size="xs"
          leftIcon={<FiFilter />}
        >
          Filters
        </Button>
      </SectionHeading>

      <Flex direction={['column', 'column', 'column', 'row']} pb="1rem">
        <Box width={{ xs: '100%', xl: '70%' }}>
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
    </Box>
  )
}

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
