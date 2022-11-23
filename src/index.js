import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Connect } from "@stacks/connect-react";

import { userSession } from "./components/ConnectWallet";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Connect
      authOptions={{
        appDetails: {
          name: "Stacks React Template",
          // todo:
          icon: window.location.origin + "/logo.png",
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <App />
    </Connect>
  </React.StrictMode>
);
