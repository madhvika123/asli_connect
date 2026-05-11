// src/NetworkStatusContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const NetworkStatusContext = createContext();

export const NetworkStatusProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState("Online");
  const [isOnline, setIsOnline] = useState(true);

  const updateNetworkStatus = () => {
    if (navigator.onLine) {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      if (connection && connection.effectiveType) {
        if (connection.effectiveType === "2g") {
          setConnectionStatus("Low Connectivity");
        } else {
          setConnectionStatus("Online");
        }
      } else {
        setConnectionStatus("Online");
        // window.location.reload();
      }
      setIsOnline(true);
    } else {
      setIsOnline(false);
      setConnectionStatus("No Connectivity");
    }
  };

  useEffect(() => {
    updateNetworkStatus(); // Initial check
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  const checkStatusAfterRetry = () => {
    updateNetworkStatus(); // Check status after retry
  };

  return (
    <NetworkStatusContext.Provider
      value={{ connectionStatus, checkStatusAfterRetry }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => useContext(NetworkStatusContext);
