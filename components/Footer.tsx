import { Flex, Link, Text, Box } from '@chakra-ui/core'
import { Card } from '../components/Card'
import { VscGithub } from 'react-icons/vsc'
import { BiDonateHeart } from 'react-icons/bi'
export const Footer = () => (
  <Card>
    <Flex direction="column" alignItems="center" justifyContent="space-between">
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
    </Flex>
  </Card>
)
