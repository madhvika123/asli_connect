import { useState, useEffect } from "react";
import { fetchData, putData } from "../../api/apiService";
import { useSelector } from "react-redux";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    role: "admin",
  });

  const [editForm, setEditForm] = useState({ ...adminData });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});

  const id = useSelector((state) => state.userProfile?._id);

  useEffect(() => {
    if (id) fetchAdminProfile();
  }, [id]);

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true);

      const response = await fetchData(`/api/admin-profile/view/${id}`);
      if (response?.admin) {
        setAdminData(response.admin);
        setEditForm(response.admin);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Full name is required";
    if (!editForm.email.includes("@")) errors.email = "Valid email required";
    if (!/^\d{10}$/.test(editForm.phoneNo)) errors.phoneNo = "Phone must be 10 digits";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSaveProfile = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      const response = await putData(`/api/admin-profile/update/${id}`, { email: editForm.email.trim(), phoneNo: editForm.phoneNo.trim() });

      if (response?.status === 200) {
        setAdminData(editForm);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.message || "Update failed" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const primaryColor = "#1D4ED8";

  if (isLoading && !adminData.name) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-10">

        {message.text && (
          <div className={`mb-8 p-4 rounded-lg font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700" }`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 sm:mb-0">
            {adminData.name}
          </h2>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-lg font-semibold text-white" style={{ backgroundColor: primaryColor }}>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleSaveProfile} className="px-6 py-2.5 rounded-lg font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                Save
              </button>
              <button onClick={() => {
                  setIsEditing(false);
                  setEditForm(adminData);
                  setValidationErrors({});
                }}
                className="px-6 py-2.5 rounded-lg border"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                Personal Information
              </h3>

              <div className="space-y-4 text-gray-800">
                <p>
                  <span className="font-semibold">Email:</span>
                  <span className="ml-2">{adminData.email}</span>
                </p>

                <p>
                  <span className="font-semibold">Phone:</span>
                  <span className="ml-2">{adminData.phoneNo}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
                Role Information
              </h3>

              <div className="space-y-4 text-gray-800">
                <p>
                  <span className="font-semibold">Role:</span>
                  <span className="ml-2 capitalize">{adminData.role}</span>
                </p>
              </div>

            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-8 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
              Edit Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="font-medium">Full Name</label>
                <input className="w-full mt-2 p-3 border rounded-lg bg-gray-100 cursor-not-allowed" value={editForm.name} disabled />
              </div>

              <div>
                <label className="font-medium">Email</label>
                <input className="w-full mt-2 p-3 border rounded-lg" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                {validationErrors.email && (<p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>)}
              </div>

              <div>
                <label className="font-medium">Phone</label>
                <input className="w-full mt-2 p-3 border rounded-lg" maxLength={10} value={editForm.phoneNo} onChange={(e) => setEditForm({ ...editForm, phoneNo: e.target.value.replace(/\D/g, "") })} />
                {validationErrors.phoneNo && (<p className="text-red-600 text-sm mt-1">{validationErrors.phoneNo}</p>)}
              </div>

              <div>
                <label className="font-medium">Role</label>
                <input className="w-full mt-2 p-3 border rounded-lg bg-gray-100 cursor-not-allowed" value={editForm.role} disabled />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
