import {
  As,
  Box,
  Center,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { RiFlightTakeoffLine, RiHome2Fill } from "react-icons/ri";
import { Link as RouterLink } from "react-router-dom";

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
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Flex direction="column" h="100vh">
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
