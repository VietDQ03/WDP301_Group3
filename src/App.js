import React from "react";
import ROUTER from "./router";
import { useRoutes } from "react-router";

function App() {
  const routing = useRoutes(ROUTER);

  return (
    <div className="layout-center">
      <div className="layout-max-width">
        {routing}
      </div>
    </div>
  );
}

export default App;