import "@ant-design/v5-patch-for-react-19";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App"; // Your main App component
import NextApp from "./NextApp"; // Custom component
import { store, persistor } from "./redux/Store"; // Redux setup
// import { NetworkStatusProvider } from "./routes/NetworkStatus/NetworkStatusContext";
// import NetworkStatusMessage from "./routes/NetworkStatus/NetworkStatusMessage";
import "./index.css"; // Global CSS
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <NetworkStatusProvider>
            <NetworkStatusMessage /> */}
            <NextApp />
          {/* </NetworkStatusProvider> */}
        </PersistGate>
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
);

reportWebVitals();
