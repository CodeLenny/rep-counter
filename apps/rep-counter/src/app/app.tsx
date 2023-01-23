// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChakraProvider, extendTheme, theme } from "@chakra-ui/react";
import PouchDB from "pouchdb-browser";
import { useMemo } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Provider } from "use-pouchdb";
import { LandingPage } from "./pages";
import { SetPage } from "./pages/set/set-id";
import { QuickStartPage } from "./pages/start";

const appTheme = extendTheme({}, theme);

const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
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
  const sets = useMemo(() => new PouchDB("sets"), []);

  return (
    <Provider default="sets" databases={{ sets }}>
      <ChakraProvider theme={appTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
