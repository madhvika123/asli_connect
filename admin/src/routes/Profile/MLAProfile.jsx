// import { useState, useEffect, useRef } from "react";
// import { fetchData, postData } from "../../api/apiService";
// import { handleUpload } from "../../utils/FileUpload";
// import { IoMdCloudUpload } from "react-icons/io";
// import { BiSolidTrash } from "react-icons/bi";
// import { Modal } from "antd";
// //import Changepassword from '../../containers/Change_password/changepassword';
// import ProfileChangepassword from "./ProfileChangePassword";

// export default function MLAProfile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [pendingImageUrl, setPendingImageUrl] = useState(null);
//   const [pendingFile, setPendingFile] = useState(null);
//   const [shouldDeletePhoto, setShouldDeletePhoto] = useState(false);
//   const fileInputRef = useRef(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const [adminData, setAdminData] = useState({
//     user: {
//       name: "",
//       email: "",
//       phone: "",
//     },
//     constituency: {
//       name: "",
//       assemblyConstituencyId: "",
//       citizenCount: "",
//       parliamentaryConstituency: {
//         name: "",
//         parliamentaryConstituencyId: "",
//       },
//       state: {
//         name: "",
//         code: "",
//       },
//       district: {
//         name: "",
//         code: "",
//       },
//     },
//     address: "",
//     status: "active",
//     isActive: true,
//     party: {
//       name: "",
//       abbreviation: "",
//       symbol: "",
//       leader: "",
//       founded: "",
//       mlaCount: 0,
//     },
//     socialMediaLinks: [],
//   });

//   const [editForm, setEditForm] = useState({ ...adminData });
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [validationErrors, setValidationErrors] = useState({
//     name: "",
//     email: "",
//     phone: ""
//   });

//   // Fetch MLA profile data on component mount
//   useEffect(() => {
//     fetchMLAProfile();
//   }, []);

//   const fetchMLAProfile = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetchData("/api/mla/get-mla-profile");

//       if (response && response.data) {
//         setAdminData(response.data);
//         setEditForm(response.data);

//         // Only set imageUrl if avatar exists in response
//         if (response.data.avatar) {
//           setImageUrl(response.data.avatar);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching MLA profile:", error);
//       setMessage({
//         type: "error",
//         text: "Failed to load profile data. Please try again.",
//       });
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Validation functions
//   const validateName = (name) => {
//     const nameRegex = /^[A-Za-z\s]+$/;
//     if (!name.trim()) {
//       return 'Full name is required';
//     }
//     if (!nameRegex.test(name)) {
//       return 'Full name should contain only letters and spaces';
//     }
//     if (name.trim().length < 2) {
//       return 'Full name should be at least 2 characters long';
//     }
//     return '';
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim()) {
//       return 'Email is required';
//     }
//     if (!email.includes('@')) {
//       return 'Email must contain @ symbol';
//     }
//     if (!email.includes('.com')) {
//       return 'Email must contain .com domain';
//     }
//     if (!emailRegex.test(email)) {
//       return 'Please enter a valid email address';
//     }
//     return '';
//   };

//   const validatePhone = (phone) => {
//     const phoneRegex = /^\d{10}$/;
//     if (!phone.trim()) {
//       return 'Phone number is required';
//     }
//     if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
//       return 'Phone number must be exactly 10 digits';
//     }
//     return '';
//   };

//   // Handle input changes with validation
//   const handleInputChange = (field, value) => {
//     // Update the nested user object
//     setEditForm({ 
//       ...editForm, 
//       user: { 
//         ...editForm.user, 
//         [field]: value 
//       } 
//     });
    
//     // Validate the field
//     let error = '';
//     switch (field) {
//       case 'name':
//         error = validateName(value);
//         break;
//       case 'email':
//         error = validateEmail(value);
//         break;
//       case 'phone':
//         error = validatePhone(value);
//         break;
//       default:
//         break;
//     }
    
//     setValidationErrors(prev => ({
//       ...prev,
//       [field]: error
//     }));
//   };

//   // Handle file selection - only create preview, don't upload
//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const validExtensions = [".png", ".jpg", ".jpeg"];
//     const fileExtension = file.name
//       .slice(file.name.lastIndexOf("."))
//       .toLowerCase();

//     if (!validExtensions.includes(fileExtension)) {
//       setMessage({
//         type: "error",
//         text: "Unsupported file type. Please upload files in formats: PNG, JPG, JPEG",
//       });
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//       return;
//     }

//     if (file.size > 5242880) {
//       setMessage({
//         type: "error",
//         text: "File size exceeds the maximum limit of 5MB.",
//       });
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//       return;
//     }

//     // Create preview URL only - don't upload yet
//     const previewUrl = URL.createObjectURL(file);
//     setPendingImageUrl(previewUrl);
//     setPendingFile(file);
//     setShouldDeletePhoto(false); // If user uploads new file, cancel deletion

//     // Clear any previous error messages
//     setMessage({ type: "", text: "" });
//   };

//   // Remove pending photo or mark for deletion (only in edit mode)
//   const handleRemovePhoto = () => {
//     if (pendingImageUrl) {
//       // If there's a pending image, remove it
//       URL.revokeObjectURL(pendingImageUrl);
//       setPendingImageUrl(null);
//       setPendingFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } else if (imageUrl) {
//       // If there's a current image but no pending image, mark it for deletion
//       setShouldDeletePhoto(true);
//       setPendingImageUrl(null); // Clear any preview
//     }
//   };

//   // Handle file upload when save is clicked
//   const handleFileUploadOnSave = async () => {
//     if (!pendingFile) {
//       if (shouldDeletePhoto) {
//         return ""; // Return empty string if photo should be deleted
//       }
//       return imageUrl; // Return current imageUrl if no changes
//     }

//     try {
//       const uploadedUrl = await handleUpload(pendingFile);

//       if (uploadedUrl) {
//         setMessage({
//           type: "success",
//           text: "Avatar uploaded successfully",
//         });
//         return uploadedUrl;
//       }
//     } catch (error) {
//       console.error("File upload failed:", error);
//       setMessage({
//         type: "error",
//         text: "File upload failed. Please try again.",
//       });
//       throw error; // Re-throw to handle in save function
//     }
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//     setEditForm({ ...adminData });
//     // Reset pending states when entering edit mode
//     setPendingImageUrl(null);
//     setPendingFile(null);
//     setShouldDeletePhoto(false);
//     setValidationErrors({ name: '', email: '', phone: '' });
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditForm({ ...adminData });
//     // Clean up pending image URL and file
//     if (pendingImageUrl) {
//       URL.revokeObjectURL(pendingImageUrl);
//     }
//     setPendingImageUrl(null);
//     setPendingFile(null);
//     setShouldDeletePhoto(false);
//     setValidationErrors({ name: '', email: '', phone: '' });
//     setMessage({ type: "", text: "" });
//   };

//   const handleSaveProfile = async () => {
//     // Validate all fields before saving
//     const nameError = validateName(editForm.user?.name || '');
//     const emailError = validateEmail(editForm.user?.email || '');
//     const phoneError = validatePhone(editForm.user?.phone || '');

//     if (nameError || emailError || phoneError) {
//       setValidationErrors({
//         name: nameError,
//         email: emailError,
//         phone: phoneError
//       });
//       setMessage({
//         type: 'error',
//         text: 'Please fix the validation errors before saving.'
//       });
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//       return;
//     }

//     try {
//       setIsLoading(true);

//       let finalAvatarUrl = imageUrl; // Start with current avatar

//       // Handle file operations (upload new file or delete existing)
//       if (pendingFile || shouldDeletePhoto) {
//         finalAvatarUrl = await handleFileUploadOnSave();
//       }

//       // Prepare data for API call
//       const updateData = {
//         name: editForm.user?.name?.trim() || '',
//         email: editForm.user?.email?.trim() || '',
//         phone: editForm.user?.phone?.trim() || '',
//         avatar: finalAvatarUrl, // Use the final avatar URL (either existing, newly uploaded, or empty if deleted)
//       };

//       const response = await postData("/api/mla/edit-mla-profile", updateData);
//       console.log(response);

//       if (response?.responseCode === 200) {
//         // Update local state with new data
//         const updatedData = {
//           ...editForm,
//           avatar: finalAvatarUrl,
//         };
//         setAdminData(updatedData);
//         setImageUrl(finalAvatarUrl); // Update the actual image URL

//         // Clean up pending states
//         if (pendingImageUrl) {
//           URL.revokeObjectURL(pendingImageUrl);
//         }
//         setPendingImageUrl(null);
//         setPendingFile(null);
//         setShouldDeletePhoto(false);
//         setValidationErrors({ name: '', email: '', phone: '' });

//         setIsEditing(false);
//         setMessage({ type: "success", text: "Profile updated successfully!" });
//       } else {
//         throw new Error(response?.message || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating admin profile:", error);
//       setMessage({
//         type: "error",
//         text:
//           error.response?.data?.message ||
//           "Failed to update profile. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     }
//   };

//   // Handle social media icon click
//   const handleSocialMediaClick = (platform, url) => {
//     if (url) {
//       window.open(url, "_blank", "noopener,noreferrer");
//     }
//   };

//   // Social Media Icon Components
//   const FacebookIcon = () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//     </svg>
//   );

//   const InstagramIcon = () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.866 3.75 13.715 3.75 12.417s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
//     </svg>
//   );

//   const TwitterIcon = () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//     </svg>
//   );

//   const YouTubeIcon = () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//     </svg>
//   );

//   const getSocialMediaIcon = (platform) => {
//     switch (platform.toLowerCase()) {
//       case "facebook":
//         return <FacebookIcon />;
//       case "instagram":
//         return <InstagramIcon />;
//       case "twitter":
//         return <TwitterIcon />;
//       case "youtube":
//         return <YouTubeIcon />;
//       default:
//         return null;
//     }
//   };

//   // Other Icon Components
//   const UserIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//       />
//     </svg>
//   );

//   const MailIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//       />
//     </svg>
//   );

//   const PhoneIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//       />
//     </svg>
//   );

//   const LocationIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//       />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//       />
//     </svg>
//   );

//   const StatusIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     </svg>
//   );

//   const PartyIcon = () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//       />
//     </svg>
//   );

//   const EditIcon = () => (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2v-5m1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//       />
//     </svg>
//   );

//   const SaveIcon = () => (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M5 13l4 4L19 7"
//       />
//     </svg>
//   );

//   const CloseIcon = () => (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   );

//   const ChangePasswordIcon = () => (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//       />
//     </svg>
//   );

//   const LoadingSpinner = () => (
//     <svg
//       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       ></circle>
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//       ></path>
//     </svg>
//   );

//   const primaryColor = "#3D8926";
//   const primaryHover = "#2F6C1D";

//   // Show loading state
//   if (isLoading && !adminData.user?.name) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           backgroundColor: "white",
//           fontFamily:
//             'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div>Loading profile...</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-white"
//       style={{
//         fontFamily:
//           'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//         {/* Main Heading */}

//         {/* Profile Info Section - Removed border, kept box shadow */}
//         <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl">
//           {message.text && (
//             <div
//               className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg"
//               style={{
//                 backgroundColor:
//                   message.type === "success" ? "#f6ffed" : "#fff2f0",
//                 border: `1px solid ${
//                   message.type === "success" ? "#b7eb8f" : "#ffccc7"
//                 }`,
//                 color: message.type === "success" ? "#52c41a" : "#ff4d4f",
//                 fontWeight: "500",
//               }}
//             >
//               {message.text}
//             </div>
//           )}

//           {/* Header with Profile Photo, Name and Edit Button */}

//           <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
//             {/* Profile Photo Section - Left Side */}
//             <div className="w-full sm:w-auto flex-shrink-0">
//               <div className="mb-4">
//                 {/* Profile Photo Display/Upload Area */}
//                 <div className="flex flex-col sm:flex-row items-start gap-4">
//                   {isEditing ? (
//                     <>
//                       {/* Edit Mode: Show upload area and delete button */}
//                       <div className="flex flex-col lg:flex-row items-center gap-5">
//                         <div
//                           className="w-full lg:w-auto border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-white transition-all duration-300 flex-1"
//                           onClick={() => fileInputRef.current?.click()}
//                           onMouseEnter={(e) => {
//                             e.target.style.borderColor = primaryColor;
//                             e.target.style.backgroundColor = "#f8f9fa";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.borderColor = "#d1d5db";
//                             e.target.style.backgroundColor = "white";
//                           }}
//                         >
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             className="hidden"
//                             onChange={handleFileSelect}
//                             accept="image/*"
//                           />

//                           {/* Show pending image if exists, otherwise show current image unless marked for deletion */}
//                           {pendingImageUrl ? (
//                             <div className="flex flex-col items-center">
//                               <img
//                                 src={pendingImageUrl}
//                                 alt="New avatar preview"
//                                 className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-full mb-3"
//                               />
//                               <p className="text-sm lg:text-base text-gray-600 mb-1">
//                                 New photo selected
//                               </p>
//                               <p className="text-xs lg:text-sm text-gray-500">
//                                 Click save to update
//                               </p>
//                             </div>
//                           ) : imageUrl && !shouldDeletePhoto ? (
//                             <div className="flex flex-col items-center">
//                               <img
//                                 src={imageUrl}
//                                 alt="Current avatar"
//                                 className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-full mb-3"
//                               />
//                               <p className="text-sm lg:text-base text-gray-600 mb-1">
//                                 Current photo
//                               </p>
//                               <p className="text-xs lg:text-sm text-gray-500">
//                                 Click to upload new photo
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="flex flex-col items-center">
//                               <IoMdCloudUpload
//                                 size={36}
//                                 className="text-gray-400 mb-3"
//                               />
//                               <p className="text-sm lg:text-base text-gray-600 mb-1">
//                                 {shouldDeletePhoto
//                                   ? "Photo marked for deletion"
//                                   : "Click to upload avatar"}
//                               </p>
//                               <p className="text-xs lg:text-sm text-gray-500">
//                                 PNG, JPG, JPEG up to 5MB
//                               </p>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Show delete button only when there's a pending image, existing image, or photo marked for deletion */}
//                         {(pendingImageUrl ||
//                           (imageUrl && !shouldDeletePhoto) ||
//                           shouldDeletePhoto) && (
//                           <button
//                             onClick={handleRemovePhoto}
//                             style={{
//                               backgroundColor: shouldDeletePhoto
//                                 ? "#fef3c7"
//                                 : "#fee2e2",
//                               color: shouldDeletePhoto ? "#d97706" : "#dc2626",
//                               border: "none",
//                               borderRadius: "8px",
//                               padding: "12px",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               flexShrink: 0
//                             }}
//                             title={
//                               shouldDeletePhoto
//                                 ? "Restore photo"
//                                 : pendingImageUrl
//                                 ? "Remove new photo"
//                                 : "Remove current photo"
//                             }
//                             className="self-center lg:self-auto"
//                           >
//                             <BiSolidTrash size={18} />
//                           </button>
//                         )}
//                       </div>
//                     </>
//                   ) : (
//                     /* View Mode: Show only the current profile photo */
//                     <div
//                       className={`
//                           w-16 h-16 sm:w-20 sm:h-20
//                           lg:w-32 lg:h-32                /*  NEW: bigger on large screens   */
//                           rounded-full overflow-hidden flex items-center justify-center bg-gray-50
//                         `}
//                     >
//                       {imageUrl ? (
//                         <img
//                           src={imageUrl}
//                           alt="Avatar"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex flex-col items-center text-gray-600">
//                           <UserIcon />
//                           <span className="text-xs mt-1">No Photo</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Name and Details - Middle */}
//             <div className="flex-1 text-left pt-0 sm:pt-2 w-full sm:w-auto">
//               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
//                 {adminData.user?.name || "Loading..."}
//               </h2>
//               <p className="text-gray-600 mb-4 text-base sm:text-lg font-medium">
//                 {adminData.constituency?.name} Constituency
//               </p>
//               <div className="flex items-center gap-1.5">
//                 <span
//                   className="text-sm flex items-center gap-1.5 font-medium"
//                   style={{ color: adminData.isActive ? "#28a745" : "#dc3545" }}
//                 >
//                   <StatusIcon />
//                   {adminData.status
//                     ? adminData.status.charAt(0).toUpperCase() +
//                       adminData.status.slice(1)
//                     : "Active"}
//                 </span>
//               </div>
//             </div>

//             {/* Edit/Save/Cancel Buttons - Right Side */}
//             {!isEditing ? (
//               <div className="flex flex-col md:flex-column lg:flex-col gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
//                 <button
//                   onClick={handleEditProfile}
//                   disabled={isLoading}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap h-fit disabled:opacity-60 disabled:cursor-not-allowed"
//                   style={{
//                     backgroundColor: primaryColor,
//                     color: "#ffffff",
//                     boxShadow: "0 1px 3px rgba(61, 137, 38, 0.2)",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isLoading) {
//                       e.target.style.backgroundColor = primaryHover;
//                       e.target.style.boxShadow =
//                         "0 2px 4px rgba(61, 137, 38, 0.3)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isLoading) {
//                       e.target.style.backgroundColor = primaryColor;
//                       e.target.style.boxShadow =
//                         "0 1px 3px rgba(61, 137, 38, 0.2)";
//                     }
//                   }}
//                 >
//                   {isLoading ? <LoadingSpinner /> : <EditIcon />}
//                   <span>{isLoading ? "Loading..." : "Edit Profile"}</span>
//                 </button>

//                 {/* Change Password Button */}
//                 <button
//                   onClick={() => setIsModalVisible(true)}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap h-fit"
//                   style={{
//                     backgroundColor: primaryColor,
//                     color: "#ffffff",
//                     boxShadow: "0 1px 3px rgba(61, 137, 38, 0.2)",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = primaryHover;
//                     e.target.style.boxShadow =
//                       "0 2px 4px rgba(61, 137, 38, 0.3)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = primaryColor;
//                     e.target.style.boxShadow =
//                       "0 1px 3px rgba(61, 137, 38, 0.2)";
//                   }}
//                 >
//                   <ChangePasswordIcon />
//                   <span>Change Password</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
//                 <button
//                   onClick={handleSaveProfile}
//                   disabled={isLoading}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap h-fit disabled:opacity-60 disabled:cursor-not-allowed"
//                   style={{
//                     backgroundColor: primaryColor,
//                     color: "#ffffff",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isLoading)
//                       e.target.style.backgroundColor = primaryHover;
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isLoading)
//                       e.target.style.backgroundColor = primaryColor;
//                   }}
//                 >
//                   {isLoading ? <LoadingSpinner /> : <SaveIcon />}
//                   <span>{isLoading ? "Saving..." : "Save"}</span>
//                 </button>
//                 <button
//                   onClick={handleCancelEdit}
//                   disabled={isLoading}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap h-fit disabled:opacity-60 disabled:cursor-not-allowed"
//                   style={{
//                     backgroundColor: "#f8f9fa",
//                     color: "#6c757d",
//                     border: "1px solid #dee2e6",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isLoading) e.target.style.backgroundColor = "#e9ecef";
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isLoading) e.target.style.backgroundColor = "#f8f9fa";
//                   }}
//                 >
//                   <CloseIcon />
//                   <span>Cancel</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Profile Details */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//             {!isEditing ? (
//               <>
//                 {/* Personal Information - Left Side */}
//                 <div className="lg:col-span-1">
//                   <h3
//                     className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 pb-3"
//                     style={{ borderBottom: `2px solid ${primaryColor}` }}
//                   >
//                     Personal Information
//                   </h3>

//                   <div className="flex flex-col gap-4 sm:gap-5">
//                     <div className="flex items-center gap-3 sm:gap-4">
//                       <div
//                         className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
//                         style={{
//                           backgroundColor: "#e8f5e8",
//                           color: primaryColor,
//                         }}
//                       >
//                         <MailIcon />
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-600 mb-0.5">
//                           Email
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.user?.email || "N/A"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 sm:gap-4">
//                       <div
//                         className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
//                         style={{
//                           backgroundColor: "#e8f5e8",
//                           color: primaryColor,
//                         }}
//                       >
//                         <PhoneIcon />
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-600 mb-0.5">
//                           Phone
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.user?.phone || "N/A"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3 sm:gap-4">
//                       <div
//                         className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
//                         style={{
//                           backgroundColor: "#e8f5e8",
//                           color: primaryColor,
//                         }}
//                       >
//                         <LocationIcon />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="text-sm text-gray-600 mb-0.5">
//                           Address
//                         </div>
//                         <div className="text-base text-gray-900 font-medium leading-relaxed break-words">
//                           {adminData.address || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Constituency Information - Right Side */}
//                 <div className="lg:col-span-1">
//                   <h3
//                     className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 pb-3"
//                     style={{ borderBottom: `2px solid ${primaryColor}` }}
//                   >
//                     Constituency Information
//                   </h3>

//                   <div className="grid gap-3 sm:gap-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">
//                           Constituency Name
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.name || "N/A"}
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">
//                           Assembly ID
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.assemblyConstituencyId ||
//                             "N/A"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">
//                           Citizen Count
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.citizenCount || "N/A"}
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">
//                           Parliamentary
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.parliamentaryConstituency
//                             ?.name || "N/A"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">State</div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.state?.name || "N/A"} (
//                           {adminData.constituency?.state?.code || "N/A"})
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm text-gray-600 mb-1">
//                           District
//                         </div>
//                         <div className="text-base text-gray-900 font-medium">
//                           {adminData.constituency?.district?.name || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Social Media & Additional Information - Aligned properly */}
//                 <div className="lg:col-span-2">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//                     {/* Social Media */}
//                     <div>
//                       <h3
//                         className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 pb-3"
//                         style={{ borderBottom: `2px solid ${primaryColor}` }}
//                       >
//                         Social Media
//                       </h3>
//                       <div className="grid grid-cols-2 gap-3 sm:gap-4">
//                         {adminData.socialMediaLinks
//                           ?.filter(
//                             (l) => l.platform.toLowerCase() !== "instagram2"
//                           )
//                           .slice(0, 4)
//                           .map((link) => (
//                             <div
//                               key={link._id}
//                               onClick={() =>
//                                 handleSocialMediaClick(link.platform, link.url)
//                               }
//                               className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
//                               style={{
//                                 borderColor: "#e9ecef",
//                                 backgroundColor: "#f8f9fa",
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.backgroundColor =
//                                   "#e9ecef";
//                                 e.currentTarget.style.borderColor =
//                                   primaryColor;
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.backgroundColor =
//                                   "#f8f9fa";
//                                 e.currentTarget.style.borderColor = "#e9ecef";
//                               }}
//                             >
//                               <div
//                                 className="w-6 h-6 flex items-center justify-center"
//                                 style={{ color: primaryColor }}
//                               >
//                                 {getSocialMediaIcon(link.platform)}
//                               </div>
//                               <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
//                                 {link.platform}
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     </div>

//                     {/* Additional Information */}
//                     <div>
//                       <h3
//                         className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 pb-3"
//                         style={{ borderBottom: `2px solid ${primaryColor}` }}
//                       >
//                         Party Information
//                       </h3>

//                       <div className="flex items-start gap-4 sm:gap-6">
//                         {/* Party Symbol */}
//                         {adminData.party?.symbol && (
//                           <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
//                             <img
//                               src={adminData.party.symbol}
//                               alt={`${adminData.party.name} Symbol`}
//                               className="w-full h-full rounded-full border border-gray-300 object-cover"
//                             />
//                           </div>
//                         )}

//                         {/* Party Details */}
//                         <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               Party Name
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.party?.name || "N/A"}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               Abbreviation
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.party?.abbreviation || "N/A"}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               Leader
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.party?.leader || "N/A"}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               Founded
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.party?.founded || "N/A"}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               MLA Count
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.party?.mlaCount ?? "N/A"}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-sm text-gray-600 mb-1">
//                               Parliamentary
//                             </div>
//                             <div className="text-base text-gray-900 font-medium">
//                               {adminData.constituency?.parliamentaryConstituency
//                                 ?.name || "N/A"}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               /* Edit Form */
//               <div className="lg:col-span-2">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//                   <div>
//                     <h3
//                       className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 pb-3"
//                       style={{ borderBottom: `2px solid ${primaryColor}` }}
//                     >
//                       Edit Personal Information
//                     </h3>

//                     <div className="flex flex-col gap-4 sm:gap-5">
//                       <div>
//                         <label className="text-sm font-medium text-gray-600 block mb-2">
//                           <span style={{color: 'red'}}>*</span> Full Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.user?.name || ""}
//                           onChange={(e) => handleInputChange('name', e.target.value)}
//                           className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-colors duration-300 bg-gray-50"
//                           style={{
//                             borderColor: validationErrors.name ? '#dc3545' : '#dee2e6'
//                           }}
//                           onFocus={(e) =>
//                             (e.target.style.borderColor = primaryColor)
//                           }
//                           onBlur={(e) =>
//                             (e.target.style.borderColor = validationErrors.name ? '#dc3545' : '#dee2e6')
//                           }
//                           placeholder="Enter full name (letters and spaces only)"
//                         />
//                         {validationErrors.name && (
//                           <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
//                             {validationErrors.name}
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium text-gray-600 block mb-2">
//                           <span style={{color: 'red'}}>*</span> Email
//                         </label>
//                         <input
//                           type="email"
//                           value={editForm.user?.email || ""}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                           className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-colors duration-300 bg-gray-50"
//                           style={{
//                             borderColor: validationErrors.email ? '#dc3545' : '#dee2e6'
//                           }}
//                           onFocus={(e) =>
//                             (e.target.style.borderColor = primaryColor)
//                           }
//                           onBlur={(e) =>
//                             (e.target.style.borderColor = validationErrors.email ? '#dc3545' : '#dee2e6')
//                           }
//                           placeholder="Enter email (must contain @ and .com)"
//                         />
//                         {validationErrors.email && (
//                           <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
//                             {validationErrors.email}
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium text-gray-600 block mb-2">
//                           <span style={{color: 'red'}}>*</span> Phone
//                         </label>
//                         <input
//                           type="tel"
//                           value={editForm.user?.phone || ""}
//                           onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
//                           className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-colors duration-300 bg-gray-50"
//                           style={{
//                             borderColor: validationErrors.phone ? '#dc3545' : '#dee2e6'
//                           }}
//                           onFocus={(e) =>
//                             (e.target.style.borderColor = primaryColor)
//                           }
//                           onBlur={(e) =>
//                             (e.target.style.borderColor = validationErrors.phone ? '#dc3545' : '#dee2e6')
//                           }
//                           placeholder="Enter 10-digit phone number"
//                           maxLength={10}
//                         />
//                         {validationErrors.phone && (
//                           <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
//                             {validationErrors.phone}
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium text-gray-600 block mb-2">
//                           Address
//                         </label>
//                         <textarea
//                           value={editForm.address || ""}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               address: e.target.value,
//                             })
//                           }
//                           rows="3"
//                           className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-colors duration-300 bg-gray-50 resize-vertical font-inherit"
//                           onFocus={(e) =>
//                             (e.target.style.borderColor = primaryColor)
//                           }
//                           onBlur={(e) =>
//                             (e.target.style.borderColor = "#dee2e6")
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Modal
//         title="Change Password"
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         centered
//       >
//         <ProfileChangepassword closeModal={() => setIsModalVisible(false)} />
//       </Modal>
//     </div>
//   );
// }