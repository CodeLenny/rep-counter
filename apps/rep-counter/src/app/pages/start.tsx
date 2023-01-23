import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Switch,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";
import { useNavigate } from "react-router-dom";
import { usePouch } from "use-pouchdb";
import { Set } from "../dto/Set";
import { DashboardLayout } from "../layout/DashboardLayout";

export function QuickStartPage() {
  const navigate = useNavigate();
  const sets = usePouch<Set>("sets");

  return (
    <DashboardLayout title="Quick Start">
      <Container maxW="container.md" pt={28}>
        <Formik<Omit<Set, "_id" | "kind" | "rep">>
          initialValues={{
            exerciseId: "",
            hold: false,
            duration: 0,
            reps: 10,
            sides: "sides",
            sets: 3,
          }}
          onSubmit={async (values) => {
            const set: Set = {
              _id: customAlphabet(nolookalikesSafe)(6),
              kind: "Set",
              ...values,
              rep: [],
            };
            await sets.put(set);
            navigate(`/set/${set._id}/`);
          }}
        >
          {({ values, touched, errors }) => (
            <Form>
              <Flex my={4}>
                <Text mr={2}>I am doing</Text>
                <Field
                  as={Select}
                  id="exercise"
                  name="exerciseId"
                  variant="filled"
                  placeholder="an exercise"
                  flex="1"
                >
                  {/* <option value="123">leg lift</option> */}
                </Field>
              </Flex>
              <FormControl isInvalid={!!errors.hold && touched.hold} my={4}>
                <Field as={Switch} id="hold" name="hold" variant="filled">
                  holding this exercise for
                </Field>
                <FormErrorMessage>{errors.hold}</FormErrorMessage>
              </FormControl>
              <Flex my={4}>
                <FormControl
                  flex="1"
                  isInvalid={!!errors.duration && touched.duration}
                  isDisabled={!values.hold}
                >
                  <Field
                    as={Input}
                    type="number"
                    id="duration"
                    name="duration"
                    variant="filled"
                    placeholder={0}
                  />
                  <FormErrorMessage>{errors.duration}</FormErrorMessage>
                </FormControl>
                <Text ml={1}>seconds</Text>
              </Flex>
              <Flex my={4}>
                <FormControl flex="1" isInvalid={!!errors.reps && touched.reps}>
                  <Field
                    as={Input}
                    type="number"
                    id="reps"
                    name="reps"
                    variant="filled"
                    placeholder={10}
                  />
                  <FormErrorMessage>{errors.reps}</FormErrorMessage>
                </FormControl>
                <Text ml={1}>times in a row</Text>
              </Flex>
              <FormControl my={4} isInvalid={!!errors.sides && touched.sides}>
                <Field as={Select} id="sides" name="sides" variant="filled">
                  <option value="single">per rep</option>
                  <option value="sides">on each side</option>
                </Field>
              </FormControl>
              <Flex my={4}>
                <Text mr={1}>repeating</Text>
                <FormControl flex={1} isInvalid={!!errors.sets && touched.sets}>
                  <Field
                    as={Input}
                    type="number"
                    id="sets"
                    name="sets"
                    variant="filled"
                    placeholder={3}
                  />
                </FormControl>
                <Text ml={1}>
                  times {values.sides === "sides" && "on each side"}
                </Text>
              </Flex>
              <Button type="submit">Start</Button>
            </Form>
          )}
        </Formik>
      </Container>
    </DashboardLayout>
  );
}
