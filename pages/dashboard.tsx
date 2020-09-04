import { Box, Divider, Heading } from '@chakra-ui/core'
import { FilterSidebarProvider } from '../components/FilterSidebar'
import { Footer } from '../components/Footer'
import { EarningsSection, YourPools } from '../components/Pools'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'

export default () => (
  <Box>
    <Heading as="h2">Your Farms</Heading>
    <Divider />
    <EarningsSection />
    <YourPools />
  </Box>
)
