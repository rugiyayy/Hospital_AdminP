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
  Button,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { FaBell } from "react-icons/fa";
import { FaRegRegistered } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { AiOutlineTeam, AiOutlineHome } from "react-icons/ai";
import { BsFolder2, BsCalendarCheck, BsFolder2Open } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCalendarCheck,
  faFolderOpen,
  faHospital,
  faPaperPlane,
  faPeopleGroup,
  faPerson,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/slices/accountSlice";
import { colors } from "../components/Constants";

export default function HeaderSideBar() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const { userName, role } = useSelector((x) => x.account);
  const dispatch = useDispatch();
  return (
    <Box as="section">
      <SidebarContent
        userName={userName}
        role={role}
        display={{ base: "none", md: "unset" }}
      />
      <Drawer w isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
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
            <Avatar
              size="sm"
              src="https://avatars2.githubusercontent.com/u/37842853?v=4"
              cursor="pointer"
            />
            {userName ? (
              <>
                <Text m="0 12px">{userName}</Text>
                <Button onClick={() => dispatch(logoutAction())}>
                  Log Out
                </Button>
              </>
            ) : (
              navigate("/signIn")
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

const SidebarContent = ({ userName, role, ...props }) => (
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
    <Flex px="4" py="10" align="center">
      <FontAwesomeIcon fontSize="36px" icon={faHospital} />
      <Text
        fontSize="2xl"
        ml="2"
        color={useColorModeValue("brand.500", "white")}
        fontWeight="semibold"
      >
        Welcome !
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

      <NavLink to="/team">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faPeopleGroup} />
          <Text ml="20px">Team</Text>
        </NavItem>
      </NavLink>
      {userName && role === "Admin" && (
        <NavLink to="/register">
          <NavItem>
            <FontAwesomeIcon color={colors.paragraph} icon={faAddressCard} />
            <Text ml="20px"> Register User</Text>
          </NavItem>
        </NavLink>
      )}
      <NavLink to="/doctor">
        <NavItem>
          <FaUserDoctor color={colors.paragraph} />
          <Text ml="20px">Doctors</Text>
        </NavItem>
      </NavLink>
      <NavLink to="/doctorRegister">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faUserPlus} />
          <Text ml="18px">Doctor Register</Text>
        </NavItem>
      </NavLink>

      <NavLink to="/patient">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faPerson} />
          <Text ml="28px">Patients</Text>
        </NavItem>
      </NavLink>

      <NavLink to="/scheduleAppointment">
        <NavItem icon={BsFolder2}>+Schedule Appointment</NavItem>
      </NavLink>

      <NavLink to="/allAppointments">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faCalendarCheck} />
          <Text ml="28px"> All Appointments</Text>
        </NavItem>
      </NavLink>

      <NavLink to="/department">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faFolderOpen} />{" "}
          <Text ml="20px"> Departments</Text>
        </NavItem>
      </NavLink>

      <NavLink to="/doctorType">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faFolderOpen} />

          <Text ml="20px"> Doctor Type</Text>
        </NavItem>
      </NavLink>
      <NavLink to="/sentEmail">
        <NavItem>
          <FontAwesomeIcon color={colors.paragraph} icon={faPaperPlane} />

          <Text ml="20px"> Sent Emails</Text>
        </NavItem>
      </NavLink>
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
