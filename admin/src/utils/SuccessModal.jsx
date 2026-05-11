import React from "react";
import { Result, Button } from "antd";
import useLogout from "./authUtils";

const SuccessModal = ({
  Text1,
  Text2,
  OkStatus,
  navigation,
  link,
  setSuccessModal,
  logoutStatus,
}) => {
  const logout = useLogout();

  return (
    <div className="flex justify-center items-center min-h-[120px] p-0">
      <div className="bg-white rounded-xl w-full max-w-md">
        <Result
          status="success"
          title={
            <p className="text-[#012250] text-xl font-semibold text-center">
              {Text1} <br /> {Text2}
            </p>
          }
          extra={
            <>
              {OkStatus && (
                <Button
                  type="primary"
                  className="bg-[#012250] hover:bg-[#02318b]"
                  onClick={() => setSuccessModal(false)}
                >
                  OK
                </Button>
              )}
              {logoutStatus && (
                <Button
                  type="primary"
                  className="bg-[#012250] hover:bg-[#02318b] ml-2"
                  onClick={() => {
                    setSuccessModal(false);
                    logout();
                  }}
                >
                  OK
                </Button>
              )}
            </>
          }
        />
      </div>
    </div>
  );
};

export default SuccessModal;
