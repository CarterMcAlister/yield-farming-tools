import { Box } from '@chakra-ui/core'
import { FilterSidebarProvider } from '../components/FilterSidebar'
import { Footer } from '../components/Footer'
import { EarningsSection, YourPools } from '../components/Pools'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'

export default () => (
  <FilterSidebarProvider>
    <Wrapper maxW="1200px">
      <TopNav />

      <Box>
        <EarningsSection />
        <YourPools />
      </Box>

      <Footer />
    </Wrapper>
  </FilterSidebarProvider>
)
