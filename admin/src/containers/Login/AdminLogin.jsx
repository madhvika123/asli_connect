import React, { useState } from "react";
import { Form, Button, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { postData } from "../../api/apiService";
import { updatingUserProfile } from "../../redux/action";
import loginImage from "../../assets/Business.png";

const STEPS = {
  LOGIN: "login",
  SEND_OTP: "sendOtp",
  VERIFY_OTP: "verifyOtp",
  RESET_PASSWORD: "resetPassword",
};

const AdminLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(STEPS.LOGIN);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ================= LOGIN =================
  const onLogin = async (values) => {
    setLoading(true);
    try {
      const res = await postData("/api/admin/auth/login", {
        email: values.email.trim(),
        password: values.password,
      });

      if (res?.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.admin.role);
        dispatch(updatingUserProfile(res.admin));
        message.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        message.error(res.message);
      }
    } catch {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!email) return message.warning("Enter registered email");
    setLoading(true);
    try {
      const res = await postData("/api/admin/forgot-password", {
        email: email.trim(),
      });
      if (res?.success) {
        message.success("OTP sent");
        setStep(STEPS.VERIFY_OTP);
      } else message.error(res.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp) return message.warning("Enter OTP");
    setLoading(true);
    try {
      const res = await postData("/api/admin/verify-otp", {
        email: email.trim(),
        otp,
      });
      if (res?.success) {
        message.success("OTP verified");
        setStep(STEPS.RESET_PASSWORD);
      } else message.error(res.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return message.warning("Fill all fields");

    if (newPassword !== confirmPassword)
      return message.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await postData("/api/admin/reset-password", {
        email: email.trim(),
        otp,
        newPassword,
      });
      if (res?.success) {
        message.success("Password reset successful");
        setStep(STEPS.LOGIN);
      } else message.error(res.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F8FF]">
      {/* LEFT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-xl">

          {/* ================= TITLES ================= */}
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">
            {step === STEPS.LOGIN && "Welcome Back"}
            {step === STEPS.SEND_OTP && "Forgot Password"}
            {step === STEPS.VERIFY_OTP && "Verify OTP"}
            {step === STEPS.RESET_PASSWORD && "Reset Password"}
          </h1>

          <p className="text-gray-500 mb-8">
            {step === STEPS.LOGIN && "Please login to your admin account"}
            {step === STEPS.SEND_OTP && "Enter your registered email"}
            {step === STEPS.VERIFY_OTP && "Enter OTP sent to your email"}
            {step === STEPS.RESET_PASSWORD && "Create a new password"}
          </p>

          {/* ================= LOGIN ================= */}
          {step === STEPS.LOGIN && (
            <Form layout="vertical" form={form} onFinish={onLogin}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdOutlineMailOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <TextField
                  label="Password"
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RiLockPasswordLine />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-10"
              >
                Login
              </Button>

              <p
                className="text-right mt-3 text-blue-600 cursor-pointer"
                onClick={() => setStep(STEPS.SEND_OTP)}
              >
                Forgot password?
              </p>
            </Form>
          )}

          {/* ================= SEND OTP ================= */}
          {step === STEPS.SEND_OTP && (
            <>
              <Input
                size="large"
                placeholder="Registered Email"
                prefix={<MdOutlineMailOutline />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-6"
              />
              <Button block type="primary" loading={loading} onClick={sendOtp}>
                Send OTP
              </Button>
            </>
          )}

          {/* ================= VERIFY OTP ================= */}
          {step === STEPS.VERIFY_OTP && (
            <>
              <Input
                size="large"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-6"
              />
              <Button block type="primary" loading={loading} onClick={verifyOtp}>
                Verify OTP
              </Button>
            </>
          )}

          {/* ================= RESET PASSWORD ================= */}
          {step === STEPS.RESET_PASSWORD && (
            <>
              <Input.Password
                size="large"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4"
              />
              <Input.Password
                size="large"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-6"
              />
              <Button
                block
                type="primary"
                loading={loading}
                onClick={resetPassword}
              >
                Reset Password
              </Button>
            </>
          )}

          {/* ================= BACK ================= */}
          {step !== STEPS.LOGIN && (
            <p
              className="text-center mt-4 text-blue-600 cursor-pointer"
              onClick={() => setStep(STEPS.LOGIN)}
            >
              Back to Login
            </p>
          )}
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#E8F0FF]">
        <img src={loginImage} alt="Login" className="max-w-lg" />
      </div>
    </div>
  );
};

export default AdminLogin;
