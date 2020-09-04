import { Box, Flex, Link, Text, Stack } from '@chakra-ui/core'
import { BiDonateHeart } from 'react-icons/bi'
import { VscGithub } from 'react-icons/vsc'
export const Footer = () => (
  <Stack spacing={2} py={4}>
    <Text textAlign="center" fontSize="sm">
      Built with 🖤 and ☕️ by{' '}
      <Link
        href="https://twitter.com/CarterMcAIister"
        target="_blank"
        rel="noopener"
      >
        @CarterMcAlister
      </Link>
    </Text>

    <Link
      display="flex"
      alignItems="center"
      justifyContent="center"
      href="https://gitcoin.co/grants/1017/yield-farming-tools"
      target="_blank"
      rel="noopener"
      fontSize="sm"
    >
      <Box as={BiDonateHeart} size={4} mr={2} />
      Support development
    </Link>
  </Stack>
)
