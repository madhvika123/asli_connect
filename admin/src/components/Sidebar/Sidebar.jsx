import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { RxDashboard } from "react-icons/rx";
import {
  FaUsers,
  FaUserTie,
  FaHandHoldingUsd,
  FaMap,
  FaMapMarkerAlt,
  FaLandmark,
} from "react-icons/fa";
import { MdPostAdd, MdVideoLibrary, MdBusiness, MdAdminPanelSettings, MdGavel, MdRequestPage } from "react-icons/md";
import { GiFireSilhouette, GiVote } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { PiGitBranchFill } from "react-icons/pi";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.includes("/admin/dashboard")) return "dashboard";
    if (location.pathname.includes("/admin/users")) return "users";
    if (location.pathname.includes("/customers/posts")) return "posts";
    if (location.pathname.includes("/customers/reels")) return "reels";
    if (location.pathname.includes("/customers/jobs")) return "jobs";
    if (location.pathname.includes("/customers")) return "custUsers";

    // if (location.pathname.includes("/admin/mla")) return "mla";
    // if (location.pathname.includes("/admin/department")) return "department";
    // if (location.pathname.includes("/admin/authority")) return "authority";
    // if (location.pathname.includes("/admin/complaint")) return "complaint";
    // if (location.pathname.includes("/admin/donations")) return "donations";
    // if (location.pathname.includes("/admin/PartyRequest")) return "partyRequest";
    // if (location.pathname.includes("/admin/PartyMember")) return "partyMember";
    return "";
  };

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={collapsed}
      width={220}
      className="shadow-lg"
      style={{ backgroundColor: "#0A2540" }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ backgroundColor: "#0A2540" }}
      >
        {!collapsed && (
          <span className="text-white text-xl font-semibold">
            <Link to="/admin/dashboard">SOCIAL MEDIA</Link>
          </span>
        )}
        <div
          className="text-white text-lg cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      <div style={{ height: 2, backgroundColor: "#1E3A8A" }} />

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{
          backgroundColor: "#0A2540",
          color: "#ffffff",
          borderRight: "none",
        }}
        className="
          [&_.ant-menu-item]:!text-white
          [&_.ant-menu-item-selected]:!bg-[#1D4ED8]
          [&_.ant-menu-item:hover]:!bg-[#1D4ED8]
          [&_.ant-menu-submenu-title]:!text-white
          [&_.ant-menu-submenu-title:hover]:!bg-[#1D4ED8]
        "
      >
        <Menu.Item key="dashboard" icon={<RxDashboard />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="users" icon={<FaUsers />}>
          <Link to="/admin/users">Admin Users</Link>
        </Menu.Item>

        <Menu.Item key="custUsers" icon={<FaUsers />}>
          <Link to="/customers">Users</Link>
        </Menu.Item>

        <Menu.Item key="posts" icon={<MdPostAdd />}>
          <Link to="/customers/posts">Posts</Link>
        </Menu.Item>

        <Menu.Item key="reels" icon={<MdVideoLibrary />}>
          <Link to="/customers/reels">Reels</Link>
        </Menu.Item>

        <Menu.Item key="jobs" icon={<GiVote />}>
          <Link to="/customers/jobs">Jobs</Link>
        </Menu.Item>




        {/* <Menu.Item key="volunteers" icon={<GiFireSilhouette />}>
          <Link to="/admin/Volunteers">Volunteers</Link>
        </Menu.Item> */}

        {/* <Menu.SubMenu key="constituency" icon={<FaMap />} title="Constituency">
          <Menu.Item key="district" icon={<FaMapMarkerAlt />}>
            <Link to="/admin/district">Districts</Link>
          </Menu.Item>
          <Menu.Item key="constituencyList" icon={<FaLandmark />}>
            <Link to="/admin/constituency">Parliament Constituencies</Link>
          </Menu.Item>
          <Menu.Item key="assembly" icon={<PiGitBranchFill />}>
            <Link to="/admin/AssemblyConstituency">
              Assembly Constituencies
            </Link>
          </Menu.Item>
        </Menu.SubMenu> */}

        {/* <Menu.Item key="mla" icon={<FaUserTie />}>
          <Link to="/admin/mla">MLA</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="department" icon={<MdBusiness />}>
          <Link to="/admin/department">Departments</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="authority" icon={<MdAdminPanelSettings />}>
          <Link to="/admin/authority">Authorities</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="complaint" icon={<MdGavel />}>
          <Link to="/admin/complaint">Complaints</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="donations" icon={<FaHandHoldingUsd />}>
          <Link to="/admin/donations">Donations</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="partyRequest" icon={<MdRequestPage />}>
          <Link to="/admin/PartyRequest">Party Member Requests</Link>
        </Menu.Item> */}

        {/* <Menu.Item key="partyMember" icon={<IoIosPeople />}>
          <Link to="/admin/PartyMember">Party Member</Link>
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
