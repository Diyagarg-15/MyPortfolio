import { lazy, Suspense } from "react";
import "./App.css";
import ScrollyCanvas from "./components/ScrollyCanvas";

const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <ScrollyCanvas />
        <Suspense>
          <MainContainer>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
