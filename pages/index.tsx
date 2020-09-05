import { Box } from '@chakra-ui/core'
import { EarningsSection, YourPools } from '../components/Pools'
import { SectionHeading } from '../components/SectionHeading'

export default () => (
  <Box>
    <SectionHeading title="Overview" />
    <EarningsSection />
    <YourPools />
  </Box>
)
