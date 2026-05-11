// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, Spin, Button, message, Radio } from "antd";
// import { useDispatch } from "react-redux";
// import { fetchData, postData } from "../../api/apiService";
// import { TextField, InputAdornment, IconButton } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { RiLockPasswordLine } from "react-icons/ri";
// import { updatingUserProfile } from "../../redux/action";

// const Login = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('admin');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   // const months = [
//   //   "Jan",
//   //   "Feb",
//   //   "Mar",
//   //   "Apr",
//   //   "May",
//   //   "Jun",
//   //   "Jul",
//   //   "Aug",
//   //   "Sep",
//   //   "Oct",
//   //   "Nov",
//   //   "Dec",
//   // ];

//   const onFinish = async (values) => {
//     let endpoint;
//     switch (selectedRole) {
//       case 'doctor':
//         endpoint = "/api/doctor/doctor-login";
//         break;
//       case 'hospital':
//         endpoint = "/api/hospital/hospital-login";
//         break;
//       case 'labcenter':
//         endpoint = "/api/labCenter/lab-center-or-lab-center-branch-login";
//         break;
//       default:
//         endpoint = "/api/doctor/doctor-login";
//     }
//     setLoading(true);
//     const formattedEmail = values?.email?.trim();
//     const userData = {
//       emailOrPhone: formattedEmail,
//       password: values?.password,
//     };
//     try {
//       const response = await postData(endpoint, userData);
//       if (response?.responseCode === 200) {
//         const token = response?.data?.token || null;
//         message.success(response?.message || "Successfully signed in");
//         localStorage.setItem("adminToken", token);
//         localStorage.setItem("userRole", selectedRole);
//         if (selectedRole === 'doctor') {
//           localStorage.setItem("doctorId", response.data.doctorId);
//           localStorage.setItem("doctorName", response.data.name);
//         }
//         if (selectedRole === 'hospital') {
//           localStorage.setItem("userPath", response.data.existingHospital?.userPath);
//         }
//         if (selectedRole === 'labcenter') {
//           localStorage.setItem("labCenterId", response.data.labCenterId);
//           localStorage.setItem("labCenterName", response.data.name);
//         }
//         // dispatch(updateToken(token));
//         await fetchUserProfile(token);
//         // REPLACE navigate("/dashboard") WITH:
//       } else if (response.responseCode === 400) {
//         message.error(response.message || "Something went wrong");
//       } else {
//         message.error(data.message);
//       }
//     } catch (error) {
//       message.error(
//         error?.error?.message || error?.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserProfile = async (token) => {
//     const role = localStorage.getItem("userRole");
//     const userPath = localStorage.getItem("userPath");
//     let endpoint = "";
//     let response;

//     // Format current date/time
//     const now = new Date();
//     const date = now.getDate().toString().padStart(2, "0");
//     const month = months[now.getMonth()];
//     const year = now.getFullYear();
//     const hours = now.getHours();
//     const minutes = now.getMinutes().toString().padStart(2, "0");
//     const ampm = hours >= 12 ? "pm" : "am";
//     const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
//     const formattedToday = `${date},${month} ${year}-${formattedHours}:${minutes} ${ampm}`;

//     setLoading(true);
//     try {
//       switch (role) {
//         case "doctor":
//           endpoint = "/api/doctor/get-doctor-profile";
//           response = await postData(endpoint, { date: formattedToday });
//           break;
//         case "hospital":
//           endpoint =
//             userPath === "Branch"
//               ? "/api/branch/branch-profile"
//               : "/api/hospital/get-hospital-profile";
//           response = await fetchData(endpoint);
//           break;
//         case "labcenter":
//           endpoint = "/api/labCenter/get-lab-center-profile";
//           response = await fetchData(endpoint);
//           break;
//         case "labcenterbranch":
//           // Add endpoint for lab center branch profile if available
//           endpoint = "/api/labCenter/get-lab-center-branch-profile";
//           response = await fetchData(endpoint);
//           break;
//         default:
//           endpoint = "/api/doctor/get-doctor-profile";
//           response = await postData(endpoint, { date: formattedToday });
//       }

//       const userData =
//         response.data && Array.isArray(response.data) && response.data.length > 0
//           ? response.data[0]
//           : response.data || {};
//       dispatch(updatingUserProfile(userData));

//       // REPLACE navigate("/dashboard") WITH:
//       if (role === "doctor") {
//         navigate("/doctordashboard");
//       } else if (role === "hospital") {
//         navigate("/hospitaldashboard");
//       } else if (role === "labcenter") {
//         navigate("/labcenterdashboard");
//       } else if (role === "labcenterbranch") {
//         navigate("/labcenterbranchdashboard");
//       } else {
//         navigate("/dashboard"); // fallback
//       }
//     } catch (err) {
//       message.error(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (

//     <div className='flex items-center justify-center min-h-screen w-full bg-white'>
//       <div className='flex bg-white rounded-none shadow-lg w-full h-screen overflow-hidden items-center justify-center'>
//         {/* <div className='hidden lg:flex flex-col justify-center w-[50%] p-10 relative'>
//           <div className='relative z-10 text-[#0A2647] ml-16'>
//             <h2 className='text-4xl font-semibold text-[#0A2647] mb-5 font-sans'>
//               Doctor App
//             </h2>
//             <h1 className='text-6xl font-semibold leading-[1.2] text-[#0A2647] mb-6 font-sans'>
//               Manage Everything in One Place
//             </h1>
//             <p className='text-[#4A4A4A] text-lg leading-relaxed max-w-lg'>
//               A powerful admin portal to manage hospital operations — from
//               doctors and appointments to billing and reports. Streamline your
//               workflow with ease.
//             </p>
//           </div>
//         </div> */}

//         <div className='w-full lg:w-[50%] flex flex-col justify-center items-center relative'>
//           <div className='bg-white w-5/6 max-w-md py-20 px-12 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative z-10'>
//             <h2 className='text-2xl font-semibold text-[#0A2647] mb-2'>
//               Sign in with Your Credentials
//             </h2>
//             <p className='text-md text-gray-500 mb-6'>
//               Please enter your email and password to continue{" "}
//             </p>

//             <Form
//               layout='vertical'
//               form={form}
//               onFinish={onFinish}
//               className='client-details-form custom-form-ant w-full mx-auto my-2'>
//               <Form.Item
//                 name='email'
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter the email",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <MdOutlineMailOutline
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Email *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   size='small'
//                   fullWidth
//                   type='text'
//                   placeholder='Enter the email'
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//               <Form.Item
//                 name='password'
//                 rules={[
//                   { required: true, message: "Please enter the Password" },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <RiLockPasswordLine
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Password *</div>
//                     </div>
//                   }
//                   fullWidth
//                   variant='outlined'
//                   placeholder='Enter the Password'
//                   size='small'
//                   type={showPassword ? "text" : "password"}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position='end'>
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge='end'>
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Form.Item>
//               {/* <Form.Item
//                 name="loginType"
//                 label="Select Login Type"
//                 rules={[{ required: true, message: 'Please select a login type!' }]}
//               >
//                 <Radio.Group
//                   className="flex justify-center space-x-6"
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   size="large"
//                 >
//                   <Radio value="doctor" className="flex items-center space-x-2">Doctor</Radio>
//                   <Radio value="hospital" className="flex items-center space-x-2">Hospital</Radio>
//                   <Radio value="labcenter" className="flex items-center space-x-2">Lab Center</Radio>
//                 </Radio.Group>
//               </Form.Item> */}
//               <footer className='flex justify-center items-center space-x-4 pt-2'>
//                 <Button type='primary' htmlType='submit' className='w-full' loading={loading}>
//                   Submit
//                 </Button>
//               </footer>
//               <p className='text-md text-gray-500 mt-2 text-end'>
//                 Forgot Password?
//               </p>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Login;
