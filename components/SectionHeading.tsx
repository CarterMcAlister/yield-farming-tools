import { Box, Divider, Flex, Heading } from '@chakra-ui/core'
import { ColorSwitch } from './ColorSwitch'

export const SectionHeading: React.FC<{
  title: string
  children?: React.ReactNode
}> = ({ title, children, ...props }) => (
  <Box pt={[0, 0, 2]} {...props} px={4}>
    <Flex justifyContent="space-between">
      <Heading as="h2" size="md" pb={2} color="gray.700">
        {title}
      </Heading>
      <Box>
        {children}
        {/* <ColorSwitch /> */}
      </Box>
    </Flex>
    <Divider />
  </Box>
)
