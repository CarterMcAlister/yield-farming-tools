import { Box, Flex } from '@chakra-ui/core'
import { ImpermanentLossCalculator } from '../components/ImpermanentLossCalc'
import { SectionHeading } from '../components/SectionHeading'

export default () => (
  <Box>
    <SectionHeading title="Tools" />
    <Flex justifyContent="center" pb="1rem">
      <ImpermanentLossCalculator />
    </Flex>
  </Box>
)
