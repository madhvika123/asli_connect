// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, Spin, Button, message, Radio } from "antd";
// import { TextField, InputAdornment, IconButton } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { RiLockPasswordLine } from "react-icons/ri";

// export default function Login() {
//   const [form] = Form.useForm();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (username === "admin" && password === "1234") {
//       localStorage.setItem("token", "fakeToken123");
//       navigate("/dashboard");
//     } else {
//       alert("Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen w-full bg-white font-poppins">
//       <div className="flex flex-col lg:flex-row bg-white shadow-lg w-[90%] mx-auto overflow-hidden rounded-none">
//         {/* Left Section */}
//         <div className=" p-10 ">
//           <div className="relative z-10 text-[#0A2647] ml-16">
//             <h2 className="text-4xl font-semibold text-[#0A2647] mb-5 font-sans">
//               Citizen App
//             </h2>
//             <h1 className="text-6xl font-semibold leading-[1.2] text-[#0A2647] mb-6 font-sans">
//               Manage Everything in One Place
//             </h1>
//             <p className="text-[#4A4A4A] text-lg leading-relaxed max-w-lg">
//               A powerful admin portal to manage hospital operations — from
//               doctors and appointments to billing and reports. Streamline your
//               workflow with ease.
//             </p>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className=" p-6 ">
//           <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative z-10 p-4">
//             <h2 className="text-2xl font-semibold text-[#0A2647] mb-2">
//               Sign in with Your Credentials
//             </h2>
//             <p className="text-md text-gray-500 mb-6">
//               Please enter your email and password to continue
//             </p>

//             <Form
//               layout="vertical"
//               form={form}
//               onFinish={handleLogin}
//               className="client-details-form custom-form-ant w-full mx-auto my-2"
//             >
//               {/* Email */}
//               <Form.Item
//                 name="email"
//                 rules={[{ required: true, message: "Please enter the email" }]}
//               >
//                 <TextField
//                   label={
//                     <div className="flex items-center">
//                       <MdOutlineMailOutline
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Email *</div>
//                     </div>
//                   }
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   type="text"
//                   placeholder="Enter the email"
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>

//               {/* Password */}
//               <Form.Item
//                 name="password"
//                 rules={[
//                   { required: true, message: "Please enter the Password" },
//                 ]}
//               >
//                 <TextField
//                   label={
//                     <div className="flex items-center">
//                       <RiLockPasswordLine
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Password *</div>
//                     </div>
//                   }
//                   fullWidth
//                   variant="outlined"
//                   placeholder="Enter the Password"
//                   size="small"
//                   type={showPassword ? "text" : "password"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Form.Item>

//               {/* Submit Button */}
//               <footer className="flex justify-center items-center space-x-4 pt-2">
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="w-full"
//                   loading={loading}
//                 >
//                   Submit
//                 </Button>
//               </footer>

//               {/* Forgot Password */}
//               <p className="text-md text-gray-500 mt-2 text-end cursor-pointer hover:underline">
//                 Forgot Password?
//               </p>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
