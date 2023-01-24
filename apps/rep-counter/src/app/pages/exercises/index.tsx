import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAllDocs, usePouch } from "use-pouchdb";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Translation } from "../../components/translation/Translation";
import { exercises } from "../../data/exercises";
import { Exercise, StoredExercise } from "../../dto/Exercise";
import { SavedExercise } from "../../dto/SavedExercise";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { RiHeart3Fill } from "react-icons/ri";
import React, { useCallback, useState } from "react";
import { createSet } from "../../lib/createSet";
import { Set } from "../../dto/Set";

const ActionSheetItem: React.FC<{
  title: string;
  description?: string;
  /**
   * If clicking this action should navigate to a page, provide the page URL.
   * This will prevent {@link onClick} from being bound.
   */
  to?: string;

  /**
   * An event listener.  Will be ignored if {@link to} is provided.
   */
  onClick?: () => void;

  disabled?: boolean;
}> = ({ title, description, to, onClick, disabled }) => {
  if (to) {
    return (
      <LinkBox as="nav" w="full" py="1" px="4" borderBottomWidth="1px">
        <Heading size="xs" mb="1">
          <LinkOverlay
            as={RouterLink}
            to={disabled ? "#" : to}
            color={disabled ? "gray.400" : undefined}
          >
            {title}
          </LinkOverlay>
        </Heading>
        {description && (
          <Text color={disabled ? "gray.400" : undefined}>{description}</Text>
        )}
      </LinkBox>
    );
  }
  return (
    <Box
      as="nav"
      w="full"
      py="1"
      px="4"
      borderBottomWidth="1px"
      cursor="pointer"
      onClick={
        onClick ??
        (() => {
          return;
        })
      }
    >
      <Heading size="xs" mb="1" color={disabled ? "gray.400" : undefined}>
        {title}
      </Heading>
      {description && (
        <Text color={disabled ? "gray.400" : undefined}>{description}</Text>
      )}
    </Box>
  );
};

export function ExerciseLibraryPage() {
  const navigate = useNavigate();
  const activityDrawer = useDisclosure();
  const [currentExercise, setCurrentExercise] = useState<
    undefined | Exercise
  >();

  const sets = usePouch<Set>("sets");
  const built_in = exercises;

  const saved = useAllDocs<SavedExercise>({
    db: "saved",
  });

  const userCreated = useAllDocs<StoredExercise>({
    db: "exercises",
  });

  const handleQuickStart = useCallback(async (exercise: Exercise) => {
    const set = createSet(exercise);
    await sets.put(set);
    navigate(`/set/${set._id}/`);
  }, []);

  return (
    <DashboardLayout title="Exercise Library">
      <Container maxW="container.lg" mt={4}>
        <Tabs variant="enclosed" isFitted>
          <TabList>
            <Tab>Public</Tab>
            <Tab isDisabled>Created</Tab>
            <Tab isDisabled>Favorites</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {built_in.map((exercise) => (
                <Card key={exercise._id}>
                  <CardHeader>
                    <Flex>
                      <Flex
                        flex="1"
                        gap="4"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Heading size="lg">
                          <Translation>{exercise.name}</Translation>
                        </Heading>
                      </Flex>
                      <IconButton
                        variant="ghost"
                        size="lg"
                        colorScheme="gray"
                        aria-label="Add to favorites"
                        icon={<RiHeart3Fill />}
                      />
                    </Flex>
                  </CardHeader>
                  <CardFooter>
                    <ButtonGroup spacing="1">
                      <Button
                        variant="solid"
                        colorScheme="purple"
                        display={{ md: "none" }}
                        onClick={() => {
                          setCurrentExercise(exercise);
                          activityDrawer.onOpen();
                        }}
                      >
                        Use Exercise
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="purple"
                        display={{ base: "none", md: "block" }}
                        onClick={() => handleQuickStart(exercise)}
                      >
                        Quick Launch
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="blue"
                        display={{ base: "none", md: "block" }}
                        disabled
                      >
                        Add to Session
                      </Button>
                      <Button
                        as={RouterLink}
                        variant="ghost"
                        colorScheme="purple"
                        to={`/exercises/default/${exercise._id}/`}
                      >
                        View Details
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      <Drawer
        isOpen={activityDrawer.isOpen}
        onClose={activityDrawer.onClose}
        size="xl"
        placement="bottom"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Actions</DrawerHeader>
          <DrawerBody>
            <ActionSheetItem
              title="Quick Launch"
              description="Jump right in to this exercise"
              onClick={() =>
                currentExercise && handleQuickStart(currentExercise)
              }
            />
            <ActionSheetItem
              title="Add to Session"
              description="Add this exercise to an impromtu workout"
              disabled
            />
            <ActionSheetItem
              title="Add to Plan"
              description="Add this workout to an existing plan"
              disabled
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </DashboardLayout>
  );
}
