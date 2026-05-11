// import React, { useState } from 'react';
// import { Spin, Form, message, Button, Input } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { postData } from "../../api/apiService";


// const ForgotPassword = () => {
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const baseURL = process.env.VITE_REACT_APP_BASE_URL;
//   console.log("Base URL:", baseURL); // Add this for debugging


//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const payload = { emailOrPhone: values.email };
//       const response =  await postData(`${baseURL}/forgotPassword`, payload);

//       if (response?.status === 200) {
//         const { responseCode, message: apiMessage, temporaryPassword } = response.data;

//         if (responseCode === 200) {
//           message.success(
//             `${apiMessage}. Your temporary password is: ${temporaryPassword}`
//           );
//           navigate('/');
//         } else {
//           message.error(apiMessage || 'An error occurred. Please try again.');
//         }
//       }
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message || 'Something went wrong. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Spin spinning={loading}>
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="flex bg-white rounded-2xl shadow-lg w-[65%] max-w-6xl overflow-hidden h-[70vh]">
//           {/* Left Section with Images */}
//           <div
//             className="hidden lg:flex flex-col items-center justify-center w-[50%] bg-white relative"
//             style={{
//               backgroundImage:
//                 "url('http://mrsasta.s3.eu-north-1.amazonaws.com/1735818811131_Login_Background.png')",
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//             }}
//           >
//             <img
//               src="http://mrsasta.s3.eu-north-1.amazonaws.com/1735818862235_Login_Title.png"
//               alt="Kaamport Logo"
//               className="h-auto w-[70%] object-contain absolute"
//             />
//           </div>

//           {/* Right Section with Form */}
//           <div className="w-full lg:w-[50%] px-4 py-7 flex flex-col items-center relative bg-white h-auto">
//             <div className="flex items-center justify-center flex-col mt-28">
//               <h2 className="text-2xl font-bold text-center mb-2 text-[#03045E]">
//                 Welcome!
//               </h2>
//               <p className="text-center text-gray-500 mb-6 text-sm">
//                 Please Enter Your Email to Reset Password
//               </p>
//               <Form
//                 form={form}
//                 name="forgotPassword"
//                 onFinish={onFinish}
//                 className="space-y-5 w-full max-w-[320px]"
//               >
//                 <Form.Item
//                   name="email"
//                   rules={[
//                     { required: true, message: 'Please enter your email address.' },
//                     { type: 'email', message: 'Please enter a valid email address.' },
//                   ]}
//                 >
//                   <Input
//                     placeholder="Email Address"
//                     size="large"
//                     style={{ borderRadius: '8px' }}
//                   />
//                 </Form.Item>

//                 <Form.Item>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     block
//                     style={{
//                       backgroundColor: '#03045E',
//                       borderRadius: '8px',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     Submit
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Spin>
//   );
// };

// export default ForgotPassword;