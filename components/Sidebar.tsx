import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  BoxProps,
} from '@chakra-ui/core'
import { CheckIcon, ChevronDownIcon, SmallAddIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaToolbox } from 'react-icons/fa'
import { GrStackOverflow } from 'react-icons/gr'
import { MdLibraryBooks } from 'react-icons/md'
import { RiDashboardFill } from 'react-icons/ri'
import { Card } from '../components/Card'
import { useEthContext } from '../contexts/ProviderContext'
import { PLACEHOLDER_ADDRESS } from '../data/constants'
import { connectToWeb3, initInfura } from '../hooks/useEthers'
import ethLogo from '../resources/eth-logo.svg'
import metamaskLogo from '../resources/metamask-fox.svg'
import { abbrWallet } from '../utils/utils'
import { Footer } from './Footer'
import constate from 'constate'

export const Sidebar: React.FC<{ showTitle?: boolean } & BoxProps> = ({
  showTitle = true,
  ...props
}) => {
  const { onOpen } = useWalletModalContext()
  const { ethApp } = useEthContext()

  return (
    <Stack pt={6.1} justifyContent="space-between" h="100%" {...props}>
      <Stack>
        {showTitle && (
          <Heading
            as="h1"
            size="sm"
            pb={5}
            display="flex"
            justifyContent="center"
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              🚜 YIELD FARMING TOOLS
            </Link>
          </Heading>
        )}
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
            <Flex alignItems="center">
              {ethApp?.YOUR_ADDRESS &&
              ethApp?.YOUR_ADDRESS !== PLACEHOLDER_ADDRESS ? (
                <>
                  <Status size="10px" color="green.300" mr={2} />
                  {abbrWallet(ethApp.YOUR_ADDRESS)}
                </>
              ) : (
                <>
                  <Status size="10px" color="red.300" mr={2} />
                  Connect Wallet
                </>
              )}
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onOpen}>
              Connect Wallet <SmallAddIcon ml={1} />
            </MenuItem>
          </MenuList>
        </Menu>

        <Stack pt={5}>
          <SidebarLink link="/" icon={<RiDashboardFill />}>
            Dashboard
          </SidebarLink>
          <SidebarLink link="/pools" icon={<GrStackOverflow />}>
            Pools
          </SidebarLink>
          <SidebarLink link="/resources" icon={<MdLibraryBooks />}>
            Resources
          </SidebarLink>
          <SidebarLink link="/tools" icon={<FaToolbox />}>
            Tools
          </SidebarLink>
        </Stack>
      </Stack>
      <Footer />
      <WalletModal />
    </Stack>
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
      size="md"
      variant={isSelected ? 'solid' : 'ghost'}
      colorScheme={isSelected ? 'teal' : null}
      rounded={10}
      height={50}
      cursor="pointer"
    >
      {children}
    </Button>
  )
}

const useWalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return { isOpen, onOpen, onClose }
}

export const [WalletModalProvider, useWalletModalContext] = constate(
  useWalletModal
)

const WalletModal = () => {
  const toast = useToast()
  const { isOpen, onClose } = useWalletModalContext()

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
      <ModalOverlay>
        <ModalContent sx={{ borderRadius: 20 }}>
          <ModalCloseButton />
          <ModalBody py={10}>
            <Heading
              as="h3"
              size="md"
              fontWeight="medium"
              textAlign="center"
              pb="15px"
            >
              Connect your wallet
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
                  icon={<CheckIcon />}
                  _hover={{ bg: '#337ACC' }}
                  _active={{ bg: '#2C6BB2' }}
                />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

const Status = ({ color, size, ...props }) => (
  <Box rounded="50%" background={color} w={size} h={size} {...props} />
)
