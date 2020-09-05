import { Box } from '@chakra-ui/core'

export const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="#fff"
    rounded="lg"
    border="1px solid #dfe8f9"
    m={4}
    p={4}
    {...props}
  >
    {children}
  </Box>
)
