// src/NetworkStatusMessage.js
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useNetworkStatus } from "./NetworkStatusContext";
import "./NetworkStatusMessage.css"; // Import CSS for styling
import { WifiOutlined } from "@ant-design/icons";

const NetworkStatusMessage = () => {
  const { connectionStatus, checkStatusAfterRetry } = useNetworkStatus();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show the modal when the connection status is "No Connectivity" or "Low Connectivity"
  useEffect(() => {
    if (
      connectionStatus === "No Connectivity" ||
      connectionStatus === "Low Connectivity"
    ) {
      setIsModalVisible(true);
    } else if (connectionStatus === "Online") {
      setIsModalVisible(false); // Close the modal when online
    }
  }, [connectionStatus]);

  // Add a custom message based on connection status
  let message = "";
  if (connectionStatus === "No Connectivity") {
    message = "You are offline. Please check your internet connection.";
  } else if (connectionStatus === "Low Connectivity") {
    message = "Your internet connection is weak. Please try again later.";
  }

  return (
    <Modal
      visible={isModalVisible}
      footer={null}
      closable={false} // Disable the close button
      centered>
      <div className='no-internet-content rounded-xl'>
        <h5 style={{ paddingBlock: "1rem" }}>Network Status</h5>
        <WifiOutlined className='no-internet-icon' /> {/* Wi-Fi icon */}
        <h6 className='no-internet-message'>No Internet Connection</h6>
        <p>{message}</p> {/* Dynamic message from props */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "12px",
          }}>
          <button
            className='retry-button'
            onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NetworkStatusMessage;
