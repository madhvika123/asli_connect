import { message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/action";
import { useCallback } from "react";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    dispatch(logoutUser());
    navigate("/", { replace: true });
    message.success("Logged-out successfully");
  }, [dispatch, navigate]);

  return logout;
};

export default useLogout;
