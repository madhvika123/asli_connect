import React from "react";
import { Dropdown, Avatar, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useLogout from "../../utils/authUtils";
import { BiLogOutCircle } from "react-icons/bi";
// import { IMAGE_BASE_URL } from "../../containers/constants";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useSelector } from "react-redux";

const Header = () => {
  const logout = useLogout();
  const profileDetails = useSelector((state) => state.userProfile);
  const userRole = localStorage.getItem("userRole") || "admin";
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "1",
      label: <span className="font-semibold">Profile</span>,
      icon: <MdOutlineManageAccounts style={{ fontSize: "18px" }} />,
      onClick: () => {
        if (userRole === "admin") navigate("/admin/profile");
      },
    },
    {
      key: "2",
      label: <span className=" font-semibold">Log out</span>,
      icon: <BiLogOutCircle style={{ fontSize: "18px" }} />,
      onClick: logout,
    },
  ];

  // const getPageTitle = (pathname) => {
  //   switch (pathname) {
  //     case "/admin/constituency":
  //       return " Parliment Constituencies";
  //     case "/admin/users":
  //       return "Users";
  //     case "/admin/PartyRequest":
  //       return "PartyRequest";
  //     case "/admin/PartyMember":
  //       return "Party Members";
  //     case "/doctors":
  //     case "/hospitalbranchdoctors":
  //     case "/branchlistofdoctorsmain":
  //       return "Doctors";
  //     case "/branches":
  //     case "/hospitalbranchmain":
  //       return "Branches";
  //     case "/dashboard":
  //     case "/doctordashboard":
  //       return "Dashboard";
  //     case "/visits":
  //     case "/hospitalbranchvisits":
  //     case "/doctormainvisits":
  //     case "/branchvisitsmain":
  //       return "Visits";
  //     case "/admin/complaint":
  //       return "Complaints";
  //     case "/admin/FinancialHelp":
  //       return "Financial Help";
  //     case "/appointments":
  //       return "Appointments";
  //     case "/admin/party":
  //       return "Parties";
  //     case "/labcenterbranch":
  //     case "/labcenterbranchesmain":
  //       return "Lab Center Branch";
  //     case "/labcenterbranchprofile":
  //       return "Lab Center Branch Profile";
  //     case "/admin/authority":
  //       return "Authority";
  //     case "/admin/department":
  //       return "Departments";
  //     case "/admin/mla":
  //       return "MLA";
  //     case "/admin/wallofhelp":
  //     case "/mla/wallofhelp":
  //       return "Wall of Help";
  //     case "/mla/events":
  //       return "Events";
  //     case "/mla/dashboard":
  //       return "Dashboard";
  //     case "/mla/PressReleases":
  //       return "Press Releases";
  //     case "/mla/Interviews":
  //       return "Interviews";
  //     case "/mla/Articles":
  //       return "Articles";
  //     case "/mla/Videos":
  //       return "Videos";
  //     case "/mla/Images":
  //       return "Photos";
  //     case "/mla/appointments":
  //       return "Appointments";
  //     case "/admin/district":
  //       return "Districts";
  //     case "/mla/Appointments":
  //       return "Appointments";
  //     case "/mla/profile":
  //       return "My Profile";
  //     case "/admin/Volunteers":
  //       return "Volunteer Management";
  //     case "/admin/profile":
  //       return "My Profile";
  //     case "/mla/NearestPartyMember":
  //       return "Nearest Party Member";
  //     case "/mla/NotifyRepresentative":
  //       return "Notify Representative";
  //     case "/admin/donations": // ✅ Added this case
  //       return "Donations";
  //     default:
  //       return "Dashboard";
  //   }
  // };

  // const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="w-full shadow z-10 !bg-white text-black">
      <div className="px-4 py-2 w-full">
        <div className="flex justify-between items-center">
          <div className="name">
            {/* <h6 className="text-2xl font-semibold text-black ">{pageTitle}</h6> */}
          </div>
          <div className="flex gap-3 justify-center items-center ">
            <div className="name text-black font-medium tracking-wide text-lg">
              <h6 className="items-end flex justify-end capitalize">
                {`${profileDetails?.name || ""}`.trim() || "Name"}
              </h6>
              {/* <h6 className="text-sm text-black font-normal flex justify-end capitalize">
                {userRole.toLocaleUpperCase() || "Role"}
              </h6> */}
            </div>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className="cursor-pointer">
                <Avatar
                  size={50}
                  shape="circle"
                  src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                  className="bg-gray-200 min-h-[50px] min-w-[50px]"
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
