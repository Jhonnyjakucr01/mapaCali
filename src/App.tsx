import { HashRouter } from "react-router-dom";

import { Suspense } from "react";
import { AppRouter } from "./router/AppRouter";


function App() {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter></AppRouter>
        </Suspense>
      </HashRouter>
    </>
  );
  // }
}

export default App;
