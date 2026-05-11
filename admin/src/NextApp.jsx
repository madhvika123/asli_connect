import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { ConfigProvider } from "antd";
import App from "./App";

const NextApp = () => {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1D4ED8",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </div>
  );
};

export default NextApp;
