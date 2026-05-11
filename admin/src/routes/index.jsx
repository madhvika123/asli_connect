import { Routes, Route, Navigate, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import AuthenticatedLayout from "../utils/authentication";
import AdminLogin from "../containers/Login/AdminLogin";
import AdminProfile from "./Profile/AdminProfile";
import Users from "./users";
import CustUsers from "./CustUsers";
import Posts from "./Posts";
import Reels from "./Reels";
import Jobs from "./JobApplications"; 

// import Constituency from "./constituency";
// import Department from "./Department";
// import Authority from "./Authority";
// import Party from "./Party";
// import MLA from "./MLA";
// import Donations from "./Donations";
// import PartyRequest from "./PartyRequests";
// import PartyMember from "./partyMember";
// import Complaint from "./Complaints";
// import FinancialHelp from "./FinancialRequests";
// import ForgotPassword from "../containers/forgot_password/forgotPassword";
// import WallOfHelp from "./WallofHelp";
// import Events from "./Events";
// import Appointments from "./Appointment";
// import PressReleases from "./LokVartha/PressReleases";
// import Articles from "./LokVartha/articles";
// import Images from "./LokVartha/images";
// import Interviews from "./LokVartha/interviews";
// import Videos from "./LokVartha/videos";
// import District from "./constituency/district";
// import AssemblyConstituency from "./constituency/assemblyConstituency";
// import Profile from "./Profile";
// import MLAProfile from "./Profile/MLAProfile";
// import NearestPartyMember from "./NearestPartyMember";
// import NotifyRepresentative from "./NotifyRepresentative";
// import Volunteers from "./Volunteers";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

// NoMatch component for unknown routes
const NoMatch = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("role");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && userType === "admin") navigate("/admin/dashboard");
      // else if (token && userType === "mla") navigate("/mla/dashboard");
      else navigate("/");
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [navigate, token, userType]);

  // Determine the redirect URL
  let redirectUrl = "/";
  if (token && userType === "admin") redirectUrl = "/admin/dashboard";
  // else if (token && userType === "mla") redirectUrl = "/mla/dashboard";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Page not found!</h2>
      <p>Redirecting to your dashboard in 10 seconds...</p>
      <p>
        <Link to={redirectUrl}>Click here if you don't want to wait</Link>
      </p>
    </div>
  );
};

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("role");

  if (token && userType === "admin") return <Navigate to="/admin/dashboard" />;
  // if (token && userType === "mla") return <Navigate to="/mla/dashboard" />;

  // If no token, show login page
  return <AdminLogin />;
};

const Sevak = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  // Redirect user immediately if they have a token
  useEffect(() => {
    if (token && userType === "admin")
      window.location.replace("/admin/dashboard");
    // else if (token && userType === "mla")
    //   window.location.replace("/mla/dashboard");
  }, [token, userType]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<AdminLogin />} />
        {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <AdminProfile />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Users />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
         <Route
          path="/customers"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <CustUsers />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/posts"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Posts />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/reels"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Reels />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
      <Route
          path="/customers/jobs"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Jobs />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
       
        {/* Catch-all route */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
};

export default Sevak;
