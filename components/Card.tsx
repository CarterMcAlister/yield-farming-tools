import { Box } from '@chakra-ui/core'

export const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="white"
    rounded="lg"
    borderWidth="1px"
    borderRadius={18}
    m={4}
    p={4}
    {...props}
  >
    {children}
  </Box>
)
