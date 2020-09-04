import { Box } from '@chakra-ui/core'

export const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="#fff"
    boxShadow="md"
    rounded="lg"
    m={4}
    p={4}
    {...props}
  >
    {children}
  </Box>
)
