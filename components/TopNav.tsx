import {
  Box,
  Button,
  Flex,
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
import { useState } from 'react'
import { Card } from '../components/Card'
import { useEthContext } from '../contexts/ProviderContext'
import { PLACEHOLDER_ADDRESS } from '../data/constants'
import { connectToWeb3, initInfura } from '../hooks/useEthers'
import ethLogo from '../resources/eth-logo.svg'
import metamaskLogo from '../resources/metamask-fox.svg'
import Link from 'next/link'

export const TopNav = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ethAddress, setEthAddress] = useState('')
  const { ethApp, setEthApp } = useEthContext()

  const connectWallet = async (address?: string) => {
    try {
      let app
      if (address) {
        app = await initInfura(address)
      } else {
        app = await connectToWeb3()
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

  return (
    <>
      <Flex as={Card} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h1" size="xl">
            <Link href="/" style={{ textDecoration: 'none' }}>
              Yield Farming Tools
            </Link>
          </Heading>
          <Text pl={{ xs: 0, md: 6 }} fontSize="md" color="gray.600">
            {tagLines[randomIndex(0, tagLines.length - 1)]}
          </Text>
          <Button
            onClick={onOpen}
            display={{ xs: 'block', sm: 'none' }}
            colorScheme="teal"
            mt={3}
          >
            {ethApp && ethApp?.YOUR_ADDRESS != PLACEHOLDER_ADDRESS
              ? 'Wallet Connected'
              : 'Connect Wallet'}
          </Button>
        </Box>
        <Flex>
          <Link href="/">Dashboard</Link>
          <Link href="/pools">Pools</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/tools">Tools</Link>
          <Button
            onClick={onOpen}
            display={{ xs: 'none', sm: 'block' }}
            colorScheme="teal"
          >
            {ethApp && ethApp?.YOUR_ADDRESS != PLACEHOLDER_ADDRESS
              ? 'Wallet Connected'
              : 'Connect Wallet'}
          </Button>
        </Flex>
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

const randomIndex = (min, max) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1))

const tagLines = [
  'Have you tended to your crops today?',
  `Don't forget to rotate your crops`,
  `It ain't much, but it's honest work`,
  'Tools and resources to help you maximize your harvest',
]
