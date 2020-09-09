import { Box, Link, Stack, Text } from '@chakra-ui/core'
import { FaTelegramPlane, FaTwitter, FaGithub } from 'react-icons/fa'
export const Footer = () => (
  <Stack spacing={2} py={4}>
    <Link
      href="https://carterm126.typeform.com/to/lrvZbH3E"
      target="_blank"
      rel="noopener"
    >
      <Text textAlign="center" fontSize="sm">
        Request features
      </Text>
    </Link>

    <Link
      display="flex"
      alignItems="center"
      justifyContent="center"
      href="https://gitcoin.co/grants/1017/yield-farming-tools"
      target="_blank"
      rel="noopener"
      fontSize="sm"
      pb={1}
    >
      Support development
    </Link>
    <Stack isInline justifyContent="center" spacing={3}>
      <Link
        href="https://t.me/yield_farming"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegramPlane />
      </Link>
      <Link
        href="https://twitter.com/CarterMcAIister"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter />
      </Link>
      <Link
        href="https://github.com/CarterMcalister/yield-farming-tools"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </Link>
    </Stack>
  </Stack>
)
