import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/core'
import { GraphQLClient } from 'graphql-request'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { PoolSection } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import Wrapper from '../components/Wrapper'
import { useAnalytics } from '../hooks/useAnalytics'
import { PLACEHOLDER_ADDRESS } from '../utils/constants'
import { connectToWallet, initInfura } from '../utils/utils'
import ethLogo from './resources/eth-logo.svg'
import metamaskLogo from './resources/metamask-fox.svg'

export const getStaticProps = async () => {
  const graphcms = new GraphQLClient(
    'https://api-us-west-2.graphcms.com/v2/ckd8c303l6v5e01z5c1mccopr/master'
  )

  const linkSectionContents = `
    id
    name
    link
    forBeginners
    description {
      text
    }
    
  `

  const sectionData = await graphcms.request(
    `
    {
      informationSection: infoLinks(where: {section: info}) {
        ${linkSectionContents}
      }
      toolSection: infoLinks(where: {section: tools}) {
        ${linkSectionContents}
      }
      tradingSection: infoLinks(where: {section: decentralized_trading}) {
        ${linkSectionContents}
      }
      walletSection: infoLinks(where: {section: wallets}) {
        ${linkSectionContents}
      }
      farmingSection: infoLinks(where: {section: yield_farming}) {
        ${linkSectionContents}
      }
      utilitySection: infoLinks(where: {section: utilities}) {
        ${linkSectionContents}
      }
    }
    `
  )

  return {
    props: sectionData,
  }
}

const randomIndex = (min, max) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1))

const tagLines = [
  'Have you tended to your crops today?',
  `Don't forget to rotate your crops`,
  `It ain't much, but it's honest work`,
  'Tools and resources to help you maximize your harvest',
]

export default function Home({
  informationSection,
  toolSection,
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) {
  const [ethApp, setEthApp] = useState(null)
  const { init, trackPageViewed } = useAnalytics()

  useEffect(() => {
    init('UA-156207639-2')
    trackPageViewed()
  }, [])

  return (
    <Wrapper maxW="1200px">
      <SEO />
      <TopNav ethApp={ethApp} setEthApp={setEthApp} />

      <Flex direction={{ xs: 'column', lg: 'row' }} pb="1rem">
        <Box width={{ xs: '100%', lg: '70%' }}>
          <PoolSection ethApp={ethApp} />
        </Box>
        <Box flexGrow={1}>
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
            Information
          </Text>
          <ResourceCard pt={0} title="" sectionContent={informationSection} />
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
            Tools
          </Text>
          <ResourceCard pt={0} title="" sectionContent={toolSection} />
        </Box>
      </Flex>

      <Heading mx="1rem" size="xl">
        Resources
      </Heading>
      <Grid templateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
        <ResourceCard
          title="🚜 Yield Farming"
          sectionContent={farmingSection}
        />
        <ResourceCard title="⚒️ Utilities" sectionContent={utilitySection} />

        <ResourceCard
          title="📈 Decentralized Trading"
          sectionContent={tradingSection}
        />

        <ResourceCard title="🔒 Wallets" sectionContent={walletSection} />
      </Grid>
    </Wrapper>
  )
}

const TopNav = ({ ethApp, setEthApp }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ethAddress, setEthAddress] = useState('')

  const connectWallet = async (address?: string) => {
    try {
      let app
      if (address) {
        app = await initInfura(address)
      } else {
        app = await connectToWallet()
      }

      setEthApp(app)
      toast({
        title: 'Address connected successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      onClose()
      setEthAddress('')
    } catch (e) {
      console.error(e)
      toast({
        title: 'An error occurred.',
        description: e,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const app = await connectToWallet()
        setEthApp(app)
      } catch {
        const app = await initInfura(PLACEHOLDER_ADDRESS)
        setEthApp(app)
      }

      // await initApp()
    })()
  }, [])

  return (
    <>
      <Flex as={Card} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h1" size="xl">
            <Box display={{ xs: 'block', md: 'inline' }}>🧑‍🌾 </Box>
            Yield Farming Tools
          </Heading>
          <Text pl={{ xs: 0, md: 12 }} fontSize="md" color="gray.600">
            {tagLines[randomIndex(0, tagLines.length - 1)]}
          </Text>
          <Button
            onClick={onOpen}
            display={{ xs: 'block', sm: 'none' }}
            variantColor="teal"
            mt={3}
          >
            {ethApp && ethApp?.YOUR_ADDRESS != PLACEHOLDER_ADDRESS
              ? 'Wallet Connected'
              : 'Connect Wallet'}
          </Button>
        </Box>
        <Button
          onClick={onOpen}
          display={{ xs: 'none', sm: 'block' }}
          variantColor="teal"
        >
          {ethApp && ethApp?.YOUR_ADDRESS != PLACEHOLDER_ADDRESS
            ? 'Wallet Connected'
            : 'Connect Wallet'}
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody py={10}>
            <Heading
              as="h3"
              size="md"
              fontWeight="medium"
              textAlign="center"
              pb="15px"
            >
              Connect your Ethereum wallet to Yield Farming Tools
            </Heading>
            <Flex
              as={Card}
              justifyContent={{ xs: 'center', md: 'space-between' }}
              alignItems="center"
              height={100}
              overflow="hidden"
            >
              <Image
                display={{ xs: 'none', md: 'block' }}
                src={metamaskLogo}
                alt="MetaMask Logo"
                height={200}
                mt="-6px"
                ml="-15px"
              />
              <Button
                onClick={() => connectWallet()}
                background="#F6851B"
                color="#FFF"
                _hover={{ bg: '#e2761B' }}
                _active={{ bg: '#CD6116' }}
              >
                Connect to Web3 Wallet
              </Button>
            </Flex>

            <Flex
              as={Card}
              justifyContent={{ xs: 'center', md: 'space-between' }}
              alignItems="center"
              height={100}
              overflow="hidden"
            >
              <Image
                display={{ xs: 'none', md: 'block' }}
                src={ethLogo}
                alt="Ethereum Logo"
                height={200}
                mt="-6px"
                ml="23px"
              />
              <Flex>
                <Input
                  placeholder="Your Ethereum address"
                  width="auto"
                  value={ethAddress}
                  onChange={(e) => setEthAddress(e.target.value)}
                />
                <IconButton
                  onClick={() => connectWallet(ethAddress)}
                  aria-label="Add address"
                  background="#4099FF"
                  color="#FFF"
                  icon="check"
                  _hover={{ bg: '#337ACC' }}
                  _active={{ bg: '#2C6BB2' }}
                />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const SEO = () => (
  <Head>
    <title>Yield Farming Tools</title>
    <meta name="title" content="Yield Farming Tools" />
    <meta
      name="description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yieldfarmingtools.com/" />
    <meta property="og:title" content="Yield Farming Tools" />
    <meta
      property="og:description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />
    <meta
      property="og:image"
      content="https://yieldfarmingtools.com/icons/thumbnail.png"
    />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yieldfarmingtools.com/" />
    <meta property="twitter:title" content="Yield Farming Tools" />
    <meta
      property="twitter:description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />
    <meta
      property="twitter:image"
      content="https://yieldfarmingtools.com/icons/thumbnail.png"
    />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="icons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="icons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="icons/favicon-16x16.png"
    />
    <link rel="manifest" href="icons/site.webmanifest" />
  </Head>
)
