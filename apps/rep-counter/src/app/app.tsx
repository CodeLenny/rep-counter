// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChakraProvider, extendTheme, theme } from "@chakra-ui/react";
import PouchDB from "pouchdb-browser";
import { useMemo } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Provider } from "use-pouchdb";
import { StoredExercise } from "./dto/Exercise";
import { SavedExercise } from "./dto/SavedExercise";
import { Set } from "./dto/Set";
import { LandingPage } from "./pages";
import { ExerciseLibraryPage } from "./pages/exercises";
import { SetPage } from "./pages/set/set-id";
import { QuickStartPage } from "./pages/start";

const appTheme = extendTheme({}, theme);

const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/exercises/",
    element: <ExerciseLibraryPage />,
  },
  {
    path: "/start/",
    element: <QuickStartPage />,
  },
  {
    path: "/set/:setId/",
    element: <SetPage />,
  },
]);

export function App() {
  const sets = useMemo(() => new PouchDB<Set>("sets"), []);
  const exercises = useMemo(() => new PouchDB<StoredExercise>("exercises"), []);
  const saved = useMemo(() => new PouchDB<SavedExercise>("saved"), []);

  return (
    <Provider default="sets" databases={{ sets, exercises, saved }}>
      <ChakraProvider theme={appTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
