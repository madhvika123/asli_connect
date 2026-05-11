// import { useState } from 'react';
// import { postData } from '../../api/apiService';
// import { Input, Button, Form, Alert } from 'antd';

// export default function ProfileChangePassword({ onClose }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' }); 

//   const primaryColor = "#3D8926";
//   const primaryHover = "#2F6C1D";

//   const onFinish = async (values) => {
//     setMessage({ type: '', text: '' });
//     setLoading(true);

//     try {
//       const response = await postData("/api/mla/change-password", values);

//       if (response && response.responseCode === 200) {
//         setMessage({ type: 'success', text: 'Password changed successfully!' });
//         form.resetFields();
//         setTimeout(onClose, 2000);
//       } else {
//         let errorMessage = response?.message || "An unknown error occurred.";

//         // Fix: Change "passwords did not match" to "Password did not match"
//         if (errorMessage.toLowerCase().includes("passwords did not match")) {
//           errorMessage = "Password did not match"; 
//         }
        
//         setMessage({ type: 'error', text: errorMessage });
//       }
//     } catch (error) {
//       console.error("Error changing password:", error);
//       let errorText = "Failed to change password. Please check your current password and try again.";

//       if (error.response?.data?.message?.toLowerCase().includes("passwords did not match")) {
//         errorText = "Password did not match";
//       }

//       setMessage({ type: 'error', text: errorText });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-2">
//       {message.text && (
//         <Alert
//           message={message.text}
//           type={message.type}
//           showIcon
//           className="mb-4"
//           closable
//         />
//       )}
      
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         // Ensures the red asterisk is used. Default behavior puts it on the left.
//         requiredMark={true} 
//       >
//         <Form.Item
//           name="currentPassword"
//           label="Current Password"
//           rules={[{ required: true, message: 'Please input your current password!' }]}
//         >
//           <Input.Password placeholder="Enter current password" />
//         </Form.Item>

//         <Form.Item
//           name="newPassword"
//           label="New Password"
//           // Removed hasFeedback
//           rules={[
//             { required: true, message: 'Please input your new password!' },
//             { min: 8, message: 'New password must be at least 8 characters' }
//           ]}
//         >
//           <Input.Password placeholder="Enter new password" />
//         </Form.Item>

//         <Form.Item
//           name="confirmPassword"
//           label="Confirm New Password"
//           dependencies={['newPassword']}
//           // Removed hasFeedback
//           rules={[
//             { required: true, message: 'Please confirm your new password!' },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 if (!value || getFieldValue('newPassword') === value) {
//                   return Promise.resolve();
//                 }
//                 // Fix: Ensures front-end validation displays "Password did not match"
//                 return Promise.reject(new Error('Password did not match')); 
//               },
//             }),
//           ]}
//         >
//           <Input.Password placeholder="Confirm new password" />
//         </Form.Item>

//         <Form.Item className="mt-6 flex justify-end gap-3">
//           <Button onClick={onClose} disabled={loading} style={{ marginRight: 8 }}>
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={loading}
//             style={{ 
//               backgroundColor: primaryColor, 
//               borderColor: primaryColor,
//               color: '#ffffff',
//             }}
//             onMouseEnter={(e) => {
//               if (!loading) {
//                 e.currentTarget.style.backgroundColor = primaryHover;
//                 e.currentTarget.style.borderColor = primaryHover;
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!loading) {
//                 e.currentTarget.style.backgroundColor = primaryColor;
//                 e.currentTarget.style.borderColor = primaryColor;
//               }
//             }}
//           >
//             Change Password
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// }