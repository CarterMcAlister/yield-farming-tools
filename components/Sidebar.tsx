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
  Stack,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Card } from '../components/Card'
import { useEthContext } from '../contexts/ProviderContext'
import { PLACEHOLDER_ADDRESS } from '../data/constants'
import { connectToWeb3, initInfura } from '../hooks/useEthers'
import ethLogo from '../resources/eth-logo.svg'
import metamaskLogo from '../resources/metamask-fox.svg'
import { Footer } from './Footer'
import { RiArticleFill } from 'react-icons/ri'
import { TiHome } from 'react-icons/ti'
import { GrStackOverflow } from 'react-icons/gr'
import { FaToolbox } from 'react-icons/fa'
import { abbrWallet } from '../utils/utils'
import { ChevronDownIcon } from '@chakra-ui/icons'
export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { ethApp } = useEthContext()

  return (
    <Box position="sticky" top={0} left={0} height="100vh" p={4} pr={0}>
      <Card
        height="100%"
        m={0}
        rounded={20}
        border={0}
        boxShadow="lg"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack>
          <Heading as="h1" size="sm" pb={5}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              🚜 YIELD FARMING TOOLS
            </Link>
          </Heading>

          <Menu>
            <MenuButton
              as={Button}
              display="flex"
              justifyContent="space-between"
              variant="solid"
              background="white"
              border="1px solid #dfe8f9"
              rightIcon={<ChevronDownIcon />}
            >
              {ethApp?.YOUR_ADDRESS &&
              ethApp?.YOUR_ADDRESS !== PLACEHOLDER_ADDRESS ? (
                <Flex alignItems="center">
                  <Status size={3} color="green" mr={2} />
                  {abbrWallet(ethApp.YOUR_ADDRESS)}
                </Flex>
              ) : (
                'Connect Wallet'
              )}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen}>Add a wallet +</MenuItem>
            </MenuList>
          </Menu>

          <Stack pt={5}>
            <SidebarLink link="/" icon={TiHome}>
              Dashboard
            </SidebarLink>
            <SidebarLink link="/pools" icon={GrStackOverflow}>
              Pools
            </SidebarLink>
            <SidebarLink link="/resources" icon={RiArticleFill}>
              Resources
            </SidebarLink>
            <SidebarLink link="/tools" icon={FaToolbox}>
              Tools
            </SidebarLink>
          </Stack>
        </Stack>
        {/* <Footer /> */}
        <WalletModal isOpen={isOpen} onClose={onClose} />
      </Card>
    </Box>
  )
}

const SidebarLink: React.FC<{ link: string; icon: any }> = ({
  link,
  icon,
  children,
}) => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push(link)
  }
  const isSelected = router.pathname === link
  return (
    <Button
      as="a"
      leftIcon={icon}
      onClick={handleClick}
      display="flex"
      justifyContent="flex-start"
      my={1}
      size="md"
      variant={isSelected ? 'solid' : 'ghost'}
      colorScheme={isSelected ? 'teal' : 'grey'}
      rounded={10}
      height={50}
      cursor="pointer"
    >
      {children}
    </Button>
  )
}

const WalletModal = ({ isOpen, onClose }) => {
  const toast = useToast()
  const [ethAddress, setEthAddress] = useState('')
  const { setEthApp } = useEthContext()

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
  )
}

const Status = ({ color, size, ...props }) => (
  <Box rounded="50%" background={color} w={size} h={size} {...props} />
)
