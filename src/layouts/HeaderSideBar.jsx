import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { FaBell } from "react-icons/fa";
import { FaRegRegistered } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { AiOutlineTeam, AiOutlineHome } from "react-icons/ai";
import { BsFolder2, BsCalendarCheck, BsFolder2Open } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

export default function HeaderSideBar() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box
      as="section"
      //   bg={useColorModeValue("gray.50", "gray.700")}
      //   minH="100vh"
    >
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer w isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          border="1px solid red"
          as="header"
          align="center"
          justifyContent={{ base: "space-between", md: "flex-end" }}
          w="full"
          px="4"
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="sm"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
            icon={<FiMenu />}
            size="md"
          />

          <Flex align="center">
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
            <Avatar
              ml="4"
              size="sm"
              name="Ahmad"
              src="https://avatars2.githubusercontent.com/u/37842853?v=4"
              cursor="pointer"
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

const SidebarContent = ({ ...props }) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    pb="10"
    overflowX="hidden"
    overflowY="auto"
    bg={useColorModeValue("white", "gray.800")}
    borderColor={useColorModeValue("inherit", "gray.700")}
    borderRightWidth="1px"
    w="60"
    {...props}
  >
    <Flex px="4" py="5" align="center">
      <Icon as={RiFlashlightFill} h={8} w={8} />
      <Text
        fontSize="2xl"
        ml="2"
        color={useColorModeValue("brand.500", "white")}
        fontWeight="semibold"
      >
        Welcome To Admin Page !!!
      </Text>
    </Flex>
    <Flex
      direction="column"
      as="nav"
      fontSize="md"
      color="gray.600"
      aria-label="Main Navigation"
    >
      <NavItem icon={AiOutlineHome}>Dashboard</NavItem>
      <NavItem icon={AiOutlineTeam}>Team</NavItem>
      <NavItem icon={BsFolder2Open}>Projects</NavItem>
      <NavItem>
        <FaUserDoctor />
        Doctors
      </NavItem>
      <NavItem icon={BsFolder2}>Patients</NavItem>
      
      <NavLink to="/">
        <NavItem icon={BsFolder2}>Appointments</NavItem>
      </NavLink>

      <NavLink to="/department">
        <NavItem icon={BsFolder2}>+Departments</NavItem>
      </NavLink>

      <NavLink to="/doctorType">
        <NavItem icon={BsFolder2}>+Doctor Type</NavItem>
      </NavLink>
      <NavItem icon={BsFolder2}>Appointments</NavItem>
      <NavLink to="/register">
        <NavItem>
          <FaRegRegistered /> Register Page
        </NavItem>
      </NavLink>
      {/* <NavItem icon={BsCalendarCheck}>Calendar</NavItem> */}
    </Flex>
  </Box>
);

const NavItem = (props) => {
  const color = useColorModeValue("gray.600", "gray.300");

  const { icon, children } = props;
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue("inherit", "gray.400")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.900"),
        color: useColorModeValue("gray.900", "gray.200"),
      }}
    >
      {icon && (
        <Icon
          mx="2"
          boxSize="4"
          _groupHover={{
            color: color,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};