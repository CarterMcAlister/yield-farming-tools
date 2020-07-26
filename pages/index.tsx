import Head from 'next/head'
import Wrapper from './Wrapper'
// import PoolsList from './Pools'
import Resources from './Info'
import { Box, Heading, Text } from '@chakra-ui/core'

export default function Home() {
  return (
    <Wrapper>
      {/* <PoolsList /> */}
      <Card>
        <Heading as="h1" size="xl">
          🧑‍🌾 Resources to help you maximize your yield.
        </Heading>
        <Text pl={12} fontSize="md" color="gray.600">
          Pool return rates and strategies coming soon.
        </Text>
      </Card>
      <Resources />
    </Wrapper>
  )
}

const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="#fff"
    boxShadow="lg"
    rounded="lg"
    m={4}
    p={4}
    pt={1}
    {...props}
  >
    {children}
  </Box>
)
