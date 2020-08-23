import { Flex } from '@chakra-ui/core'
import { useState } from 'react'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'

export default function Home() {
  const [ethApp, setEthApp] = useState(null)

  return (
    <Wrapper maxW="1200px">
      <TopNav ethApp={ethApp} setEthApp={setEthApp} />
      <Flex direction={{ xs: 'column', lg: 'row' }} pb="1rem"></Flex>
    </Wrapper>
  )
}
