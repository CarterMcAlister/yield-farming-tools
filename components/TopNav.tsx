import { Button, Flex, Heading } from '@chakra-ui/core'
import Link from 'next/link'
import { FiMenu } from 'react-icons/fi'
import { Card } from '../components/Card'
import { NavDrawer, useNavSidebarContext } from './NavSidebar'

export const TopNav = () => {
  const { onOpen } = useNavSidebarContext()

  return (
    <Flex as={Card} justifyContent="space-between" alignItems="center">
      <Heading as="h1" size="lg">
        <Link href="/" sx={{ textDecoration: 'none' }}>
          🚜 Yield Farming Tools
        </Link>
      </Heading>

      <Button onClick={onOpen}>
        <FiMenu />
      </Button>
      <NavDrawer />
    </Flex>
  )
}
