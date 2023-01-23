import {
  As,
  Box,
  Center,
  chakra,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { RiFlightTakeoffLine, RiHome2Fill } from "react-icons/ri";
import { Link, Link as RouterLink } from "react-router-dom";

const NavButton: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: As<any>;
  to: string;
  text: string;
}> = ({ text, to, icon }) => {
  return (
    <LinkBox as="nav" flex="1">
      <Stack flex="1">
        <Center>
          <Icon as={icon} />
        </Center>
        <Center>
          <LinkOverlay as={RouterLink} to={to}>
            {text}
          </LinkOverlay>
        </Center>
      </Stack>
    </LinkBox>
  );
};

export interface DashboardLayoutProps {
  title?: string;
  icon?: As<ReactNode>;
  iconHref?: string;
  children?: ReactNode;
}

export function DashboardLayout({
  icon,
  iconHref,
  title,
  children,
}: DashboardLayoutProps) {
  return (
    <Flex direction="column" h="100vh">
      <chakra.header
        bg="white"
        borderBottom="2px solid"
        borderBottomColor="gray.300"
        borderTop="6px solid"
        borderTopColor="purple.400"
        w="full"
        overflowY="hidden"
      >
        <chakra.div h="4.5rem" mx="auto" maxW="1200px">
          <Flex w="full" h="full" px="6" align="center" justify="space-between">
            <Flex align="center">
              {icon && iconHref && (
                <Link to={iconHref}>
                  <Icon as={icon} />
                </Link>
              )}
              {icon && !iconHref && <Icon as={icon} />}
              {title}
            </Flex>
          </Flex>
        </chakra.div>
      </chakra.header>
      <Box flex="1" overflowY="auto">
        {children}
      </Box>
      <Flex direction="row">
        <NavButton to="/" text="Home" icon={RiHome2Fill} />
        <NavButton to="/start/" text="Quick Start" icon={RiFlightTakeoffLine} />
      </Flex>
    </Flex>
  );
}
