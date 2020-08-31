import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/core'
import constate from 'constate'
import { Filters } from './Filters'

const useFilterSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return { isOpen, onOpen, onClose }
}

export const [FilterSidebarProvider, useFilterSidebarContext] = constate(
  useFilterSidebar
)

export const FilterDrawer = () => {
  const { isOpen, onClose } = useFilterSidebarContext()
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent overflow="scroll">
        <DrawerCloseButton />
        <DrawerHeader>Filters</DrawerHeader>

        <DrawerBody overflow="scroll">
          <Filters />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
