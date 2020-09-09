import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/core'
import constate from 'constate'
import { Sidebar } from './Sidebar'

const useNavSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return { isOpen, onOpen, onClose }
}

export const [NavSidebarProvider, useNavSidebarContext] = constate(
  useNavSidebar
)

export const NavDrawer = () => {
  const { isOpen, onClose } = useNavSidebarContext()
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent overflow="scroll">
        <DrawerCloseButton />

        <DrawerBody overflow="scroll">
          <Sidebar showTitle={false} pt={12} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
