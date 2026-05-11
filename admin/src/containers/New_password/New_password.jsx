// import React from "react";
// import { useState } from "react";
// import { Form, Input, Button, Spin } from "antd";

// const NewPassword = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = React.useState(false); // Set loading state

//   const onFinish = (values) => {
//     // Handle form submission
//     console.log("Success:", values);
//   };

//   return (
//     <Spin spinning={loading}>
//       <div className='min-h-screen flex items-center justify-center h-full'>
//         <div className='bg-white rounded-lg shadow-2xl w-fit max-w-7xl flex h-[75vh]'>
//           <div className='w-1/2 hidden lg:block'>
//             <img
//               src='/Assests/Images/Login-image.png'
//               alt='Login visual'
//               className='h-full w-full object-cover rounded-l-md'
//             />
//           </div>

//           <div className='w-96 p-4 flex flex-col items-center justify-center'>
//             <h2 className='text-2xl font-bold text-center mb-2 text-[#009A00]'>
//               Welcome to Mr.Sasta
//             </h2>
//             <p className='text-center mb-4'>Please enter your new password</p>
//             <Form
//               form={form}
//               name='newpassword'
//               onFinish={onFinish}
//               className='space-y-4 !w-80 gap-5'>
//               <Form.Item
//                 name='password'
//                 className='mt-3 text-left'
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter your password",
//                   },
//                 ]}>
//                 <Input.Password
//                   placeholder='Password'
//                   size='large'
//                   style={{ borderRadius: "8px" }}
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <Button
//                   type='primary'
//                   htmlType='submit'
//                   loading={loading}
//                   style={{
//                     backgroundColor: "#009A00",
//                     borderColor: "#009A00",
//                     color: "white",
//                     width: "100%",
//                     borderRadius: "8px",
//                   }}>
//                   Submit
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </Spin>
//   );
// };

// export default NewPassword;
