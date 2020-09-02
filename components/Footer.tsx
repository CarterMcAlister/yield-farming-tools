import { Box, Flex, Link, Text, Stack } from '@chakra-ui/core'
import { BiDonateHeart } from 'react-icons/bi'
import { VscGithub } from 'react-icons/vsc'
export const Footer = () => (
  <Stack spacing={2} pb={4} alignItems="center">
    <Link
      display="flex"
      alignItems="center"
      href="https://gitcoin.co/grants/1017/yield-farming-tools"
      target="_blank"
      rel="noopener"
    >
      <Box as={BiDonateHeart} size={5} mr={2} />
      Support further development
    </Link>

    <Text>
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
      href="https://github.com/CarterMcAlister/yield-farming-tools"
      target="_blank"
      rel="noopener"
    >
      <Box as={VscGithub} size={5} mr={2} />
      PRs welcomed
    </Link>
  </Stack>
)
