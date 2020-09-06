import { Box, Divider, Heading } from '@chakra-ui/core'

export const SectionHeading = ({ title, ...props }) => (
  <Box pt={2} {...props} px={4}>
    <Heading as="h2" size="md" pb={2} color="gray.700">
      {title}
    </Heading>
    <Divider />
  </Box>
)
