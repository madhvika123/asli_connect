// import { useState } from 'react';

// export default function ProfileMain() {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [showPassword, setShowPassword] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(null);
  
//   const [adminData, setAdminData] = useState({
//     username: 'admin_user',
//     email: 'admin@example.com',
//     fullName: 'John Doe',
//     phone: '+1234567890',
//     role: 'Super Admin',
//     joinedDate: '2024-01-15'
//   });

//   const [editForm, setEditForm] = useState({ ...adminData });
  
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const togglePasswordVisibility = (field) => {
//     setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//     setEditForm({ ...adminData });
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditForm({ ...adminData });
//     setMessage({ type: '', text: '' });
//   };

//   const handleSaveProfile = () => {
//     setAdminData({ ...editForm });
//     setIsEditing(false);
//     setMessage({ type: 'success', text: 'Profile updated successfully!' });
//     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//   };

//   const handleChangePassword = () => {
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setMessage({ type: 'error', text: 'New passwords do not match!' });
//       return;
//     }

//     if (passwordForm.newPassword.length < 8) {
//       setMessage({ type: 'error', text: 'Password must be at least 8 characters!' });
//       return;
//     }

//     setMessage({ type: 'success', text: 'Password changed successfully!' });
//     setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//   };

//   const handleForgotPassword = () => {
//     if (!forgotPasswordEmail) {
//       setMessage({ type: 'error', text: 'Please enter your email!' });
//       return;
//     }

//     setMessage({ type: 'success', text: 'Password reset link sent to your email!' });
//     setForgotPasswordEmail('');
//     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//   };

//   // Icon Components
//   const EyeIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   );

//   const EyeOffIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//     </svg>
//   );

//   const UserIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//     </svg>
//   );

//   const MailIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//     </svg>
//   );

//   const LockIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//     </svg>
//   );

//   const SaveIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   );

//   const CloseIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//     </svg>
//   );

//   const UploadIcon = () => (
//     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//     </svg>
//   );

//   const PhoneIcon = () => (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//     </svg>
//   );

//   const primaryColor = '#3D8926'; // Primary green color
//   const primaryHover = '#2d6b1a'; // Darker green for hover

//   return (
//     <div style={{ minHeight: '100vh', padding: '16px 32px', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ backgroundColor: '#ffffff', border: '1px solid #d9d9d9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
//           <div style={{ display: 'flex', gap: '4px', padding: '8px', borderBottom: '1px solid #d9d9d9' }}>
//             {['profile', 'password', 'forgot'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setMessage({ type: '', text: '' });
//                 }}
//                 style={{
//                   padding: '12px 24px',
//                   borderRadius: '8px',
//                   fontWeight: 500,
//                   border: 'none',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s',
//                   backgroundColor: activeTab === tab ? primaryColor : 'transparent',
//                   color: activeTab === tab ? '#ffffff' : '#595959',
//                   boxShadow: activeTab === tab ? '0 2px 4px rgba(24,144,255,0.3)' : 'none'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (activeTab !== tab) {
//                     e.target.style.backgroundColor = '#f5f5f5';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (activeTab !== tab) {
//                     e.target.style.backgroundColor = 'transparent';
//                   }
//                 }}
//               >
//                 {tab === 'profile' && 'Profile'}
//                 {tab === 'password' && 'Change Password'}
//                 {tab === 'forgot' && 'Forgot Password'}
//               </button>
//             ))}
//           </div>

//           <div style={{ padding: '24px' }}>
//             {message.text && (
//               <div style={{
//                 marginBottom: '24px',
//                 padding: '16px',
//                 borderRadius: '8px',
//                 backgroundColor: message.type === 'success' ? '#f6ffed' : '#fff2f0',
//                 border: `1px solid ${message.type === 'success' ? '#b7eb8f' : '#ffccc7'}`,
//                 color: message.type === 'success' ? '#52c41a' : '#ff4d4f'
//               }}>
//                 {message.text}
//               </div>
//             )}

//             {activeTab === 'profile' && (
//               <div>
//                 {!isEditing ? (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                         <div style={{ position: 'relative' }}>
//                           {profilePhoto ? (
//                             <img src={profilePhoto} alt="Profile" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #e5e7eb' }} />
//                           ) : (
//                             <div style={{ width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1d5db' }}>
//                               <svg style={{ width: '48px', height: '48px', color: '#ffffff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#262626', margin: 0 }}>My Profile</h2>
//                           <p style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>{adminData.role}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={handleEditProfile}
//                         style={{
//                           backgroundColor: primaryColor,
//                           color: '#ffffff',
//                           padding: '10px 24px',
//                           borderRadius: '8px',
//                           fontWeight: 500,
//                           border: 'none',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
//                           transition: 'background-color 0.3s'
//                         }}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = primaryHover}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
//                       >
//                         <SaveIcon />
//                         <span>Edit</span>
//                       </button>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Full Name
//                         </label>
//                         <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px' }}>
//                           <div style={{ color: '#8c8c8c', marginRight: '12px' }}>
//                             <UserIcon />
//                           </div>
//                           <p style={{ color: '#262626', margin: 0 }}>{adminData.fullName}</p>
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Email
//                         </label>
//                         <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px' }}>
//                           <div style={{ color: '#8c8c8c', marginRight: '12px' }}>
//                             <MailIcon />
//                           </div>
//                           <p style={{ color: '#262626', margin: 0 }}>{adminData.email}</p>
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Phone
//                         </label>
//                         <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px' }}>
//                           <div style={{ color: '#8c8c8c', marginRight: '12px' }}>
//                             <PhoneIcon />
//                           </div>
//                           <p style={{ color: '#262626', margin: 0 }}>{adminData.phone}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
//                       <div style={{ position: 'relative' }}>
//                         {profilePhoto ? (
//                           <img src={profilePhoto} alt="Profile" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #e5e7eb' }} />
//                         ) : (
//                           <div style={{ width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1d5db' }}>
//                             <svg style={{ width: '48px', height: '48px', color: '#ffffff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <label style={{
//                           backgroundColor: '#ffffff',
//                           border: '1px solid #d9d9d9',
//                           color: '#595959',
//                           padding: '8px 16px',
//                           borderRadius: '8px',
//                           fontWeight: 500,
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           transition: 'all 0.3s'
//                         }}
//                         onMouseEnter={(e) => e.target.style.borderColor = primaryColor}
//                         onMouseLeave={(e) => e.target.style.borderColor = '#d9d9d9'}
//                         >
//                           <UploadIcon />
//                           <span>Change Photo</span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handlePhotoChange}
//                             style={{ display: 'none' }}
//                           />
//                         </label>
//                       </div>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Full Name
//                         </label>
//                         <div style={{ position: 'relative' }}>
//                           <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }}>
//                             <UserIcon />
//                           </div>
//                           <input
//                             type="text"
//                             value={editForm.fullName}
//                             onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
//                             placeholder="Enter name"
//                             style={{
//                               width: '100%',
//                               paddingLeft: '40px',
//                               paddingRight: '16px',
//                               paddingTop: '12px',
//                               paddingBottom: '12px',
//                               border: '1px solid #d9d9d9',
//                               borderRadius: '8px',
//                               fontSize: '14px',
//                               color: '#262626',
//                               outline: 'none',
//                               transition: 'border-color 0.3s'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = primaryColor}
//                             onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                           />
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Email
//                         </label>
//                         <div style={{ position: 'relative' }}>
//                           <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }}>
//                             <MailIcon />
//                           </div>
//                           <input
//                             type="email"
//                             value={editForm.email}
//                             onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                             placeholder="Enter email"
//                             style={{
//                               width: '100%',
//                               paddingLeft: '40px',
//                               paddingRight: '16px',
//                               paddingTop: '12px',
//                               paddingBottom: '12px',
//                               border: '1px solid #d9d9d9',
//                               borderRadius: '8px',
//                               fontSize: '14px',
//                               color: '#262626',
//                               outline: 'none',
//                               transition: 'border-color 0.3s'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = primaryColor}
//                             onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                           />
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>
//                           <span style={{ color: '#ff4d4f' }}>*</span> Phone
//                         </label>
//                         <div style={{ position: 'relative' }}>
//                           <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }}>
//                             <PhoneIcon />
//                           </div>
//                           <input
//                             type="tel"
//                             value={editForm.phone}
//                             onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                             placeholder="Enter phone"
//                             style={{
//                               width: '100%',
//                               paddingLeft: '40px',
//                               paddingRight: '16px',
//                               paddingTop: '12px',
//                               paddingBottom: '12px',
//                               border: '1px solid #d9d9d9',
//                               borderRadius: '8px',
//                               fontSize: '14px',
//                               color: '#262626',
//                               outline: 'none',
//                               transition: 'border-color 0.3s'
//                             }}
//                             onFocus={(e) => e.target.style.borderColor = primaryColor}
//                             onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
//                       <button
//                         onClick={handleSaveProfile}
//                         style={{
//                           backgroundColor: primaryColor,
//                           color: '#ffffff',
//                           padding: '12px 24px',
//                           borderRadius: '8px',
//                           fontWeight: 500,
//                           border: 'none',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
//                           transition: 'background-color 0.3s'
//                         }}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = primaryHover}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
//                       >
//                         <SaveIcon />
//                         <span>Save Changes</span>
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         style={{
//                           backgroundColor: '#fafafa',
//                           color: '#595959',
//                           padding: '12px 24px',
//                           borderRadius: '8px',
//                           fontWeight: 500,
//                           border: '1px solid #d9d9d9',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '8px',
//                           transition: 'background-color 0.3s'
//                         }}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = '#fafafa'}
//                       >
//                         <CloseIcon />
//                         <span>Cancel</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'password' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <div>
//                       <LockIcon />
//                     </div>
//                     Current Password
//                   </label>
//                   <div style={{ position: 'relative' }}>
//                     <input
//                       type={showPassword.current ? 'text' : 'password'}
//                       value={passwordForm.currentPassword}
//                       onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                       style={{
//                         width: '100%',
//                         padding: '12px 48px 12px 16px',
//                         border: '1px solid #d9d9d9',
//                         borderRadius: '8px',
//                         fontSize: '14px',
//                         color: '#262626',
//                         outline: 'none',
//                         transition: 'border-color 0.3s'
//                       }}
//                       onFocus={(e) => e.target.style.borderColor = primaryColor}
//                       onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                     />
//                     <button
//                       onClick={() => togglePasswordVisibility('current')}
//                       style={{
//                         position: 'absolute',
//                         right: '12px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         color: '#8c8c8c',
//                         border: 'none',
//                         background: 'none',
//                         cursor: 'pointer',
//                         padding: '4px'
//                       }}
//                     >
//                       {showPassword.current ? <EyeOffIcon /> : <EyeIcon />}
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>New Password</label>
//                   <div style={{ position: 'relative' }}>
//                     <input
//                       type={showPassword.new ? 'text' : 'password'}
//                       value={passwordForm.newPassword}
//                       onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                       style={{
//                         width: '100%',
//                         padding: '12px 48px 12px 16px',
//                         border: '1px solid #d9d9d9',
//                         borderRadius: '8px',
//                         fontSize: '14px',
//                         color: '#262626',
//                         outline: 'none',
//                         transition: 'border-color 0.3s'
//                       }}
//                       onFocus={(e) => e.target.style.borderColor = primaryColor}
//                       onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                     />
//                     <button
//                       onClick={() => togglePasswordVisibility('new')}
//                       style={{
//                         position: 'absolute',
//                         right: '12px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         color: '#8c8c8c',
//                         border: 'none',
//                         background: 'none',
//                         cursor: 'pointer',
//                         padding: '4px'
//                       }}
//                     >
//                       {showPassword.new ? <EyeOffIcon /> : <EyeIcon />}
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959' }}>Confirm New Password</label>
//                   <div style={{ position: 'relative' }}>
//                     <input
//                       type={showPassword.confirm ? 'text' : 'password'}
//                       value={passwordForm.confirmPassword}
//                       onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                       style={{
//                         width: '100%',
//                         padding: '12px 48px 12px 16px',
//                         border: '1px solid #d9d9d9',
//                         borderRadius: '8px',
//                         fontSize: '14px',
//                         color: '#262626',
//                         outline: 'none',
//                         transition: 'border-color 0.3s'
//                       }}
//                       onFocus={(e) => e.target.style.borderColor = primaryColor}
//                       onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                     />
//                     <button
//                       onClick={() => togglePasswordVisibility('confirm')}
//                       style={{
//                         position: 'absolute',
//                         right: '12px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         color: '#8c8c8c',
//                         border: 'none',
//                         background: 'none',
//                         cursor: 'pointer',
//                         padding: '4px'
//                       }}
//                     >
//                       {showPassword.confirm ? <EyeOffIcon /> : <EyeIcon />}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleChangePassword}
//                   style={{
//                     width: '100%',
//                     backgroundColor: primaryColor,
//                     color: '#ffffff',
//                     padding: '12px 24px',
//                     borderRadius: '8px',
//                     fontWeight: 500,
//                     border: 'none',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px',
//                     boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
//                     transition: 'background-color 0.3s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = primaryHover}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
//                 >
//                   <LockIcon />
//                   <span>Change Password</span>
//                 </button>
//               </div>
//             )}

//             {activeTab === 'forgot' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
//                 <div style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
//                   <p style={{ color: '#0050b3', fontSize: '14px', margin: 0 }}>
//                     Enter your email address and we'll send you a link to reset your password.
//                   </p>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <label style={{ fontSize: '14px', fontWeight: 500, color: '#595959', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <div>
//                       <MailIcon />
//                     </div>
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={forgotPasswordEmail}
//                     onChange={(e) => setForgotPasswordEmail(e.target.value)}
//                     placeholder="admin@example.com"
//                     style={{
//                       width: '100%',
//                       padding: '12px 16px',
//                       border: '1px solid #d9d9d9',
//                       borderRadius: '8px',
//                       fontSize: '14px',
//                       color: '#262626',
//                       outline: 'none',
//                       transition: 'border-color 0.3s'
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = primaryColor}
//                     onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
//                   />
//                 </div>

//                 <button
//                   onClick={handleForgotPassword}
//                   style={{
//                     width: '100%',
//                     backgroundColor: primaryColor,
//                     color: '#ffffff',
//                     padding: '12px 24px',
//                     borderRadius: '8px',
//                     fontWeight: 500,
//                     border: 'none',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px',
//                     boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
//                     transition: 'background-color 0.3s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = primaryHover}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
//                 >
//                   <MailIcon />
//                   <span>Send Reset Link</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }