import moment from "moment";
import { Table, Avatar } from "antd";
import { InputAdornment, TextField } from "@mui/material";
import { SearchOutlined } from "@ant-design/icons";
import { postData, fetchData } from "../../api/apiService";
import React, { useState, useEffect } from "react";

import card1_Icon from "../../assets/icons/mdi_account-group-outline.png";
import card7_Icon from "../../assets/icons/circum_bullhorn.png";
import card3_Icon from "../../assets/icons/lucide_calendar.png";
import card4_Icon from "../../assets/icons/mdi_account-multiple-outline.png";
import card5_Icon from "../../assets/icons/mdi-light_clock.png";
import card6_Icon from "../../assets/icons/mynaui_heart.png";
import card2_Icon from "../../assets/icons/pepicons-pencil_handshake.png";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [hospitalsData, setHospitalsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    recentAppointments: [],
    upcomingEvents: [],
    recentPartyMembers: [],
    latestAnnouncements: [],
    monthlyDonation: [],
    recentEvents: [],
    recentUsers: [],
  });

  const userRole = localStorage.getItem("userRole") || "admin";

  console.log(userRole, "role ---------------------------");

  // Fetch dashboard data from API
  // const fetchDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchData("/api/mla/mla-dashboard");

  //     if (response.responseCode === 200) {
  //       console.log("Dashboard data fetched successfully:", response);
  //       setDashboardData(response.data);
  //       // setHospitalsData(response.data.hospitalData.hospitals);
  //       // setTotal(response.data.hospitalData.totalHospitals);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  // const fetchAnalyticsData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchData("/api/mla/mla-dashboard-analytics");
  //     if (response.responseCode === 200) {
  //       console.log("Analytics data fetched successfully:", response);
  //       setDashboardStats(response.data);
  //       setRecentUsers(response.data.recentUsers || []);
  //       setUpcomingEvents(response.data.recentEvents || []);
  //       // Process and set analytics data as needed
  //     }
  //   } catch (error) {
  //     console.error("Error fetching analytics data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchAnalyticsData();
    // fetchDashboardData();
  }, []);

  // Dummy Data
  const statsCards = [
    {
      title: "Total Citizens",
      count: dashboardStats.totalCitizens ?? "0",
      color: "#56CCF2",
      icon: card1_Icon,
    },
    {
      title: "Active Volunteers",
      count: dashboardStats.totalVolunteers ?? "0",
      color: "#27AE60",
      icon: card2_Icon,
    },
    {
      title: "Upcoming Events",
      count: dashboardStats.totalUpcomingEvents ?? "0",
      color: "#F2994A",
      icon: card3_Icon,
    },
    {
      title: "Party Members",
      count: dashboardStats.totalPartyMember ?? "0",
      color: "#9B51E0",
      icon: card4_Icon,
    },
    {
      title: "Notify Representative",
      count: dashboardStats.totalNotifyRepresentative ?? "0",
      color: "#F2C94C",
      icon: card7_Icon,
    },
    {
      title: "Wall of Help",
      count: dashboardStats.totalWallOfHelps ?? "0",
      color: "#FFB6B9",
      icon: card6_Icon,
    },
    {
      title: "Appointments",
      count: dashboardStats.totalAppointments ?? "0",
      color: "#DDDD00",
      icon: card5_Icon,
    },
  ];

  // Extract data safely
  const recentMembers = recentUsers.map((user) => ({
    name: user.name,
    date: new Date(user.createdAt).toDateString(),
  }));

  // const upcomingEvents = upcomingEvents.map((event) => ({
  //   title: event.title,
  //   location: event.location || "Not specified",
  //   date: new Date(event.publishDate || event.date).toDateString(),
  // }));

  const announcements =
    dashboardData.latestAnnouncements?.map((a) => ({
      title: a.title,
      date: new Date(a.dateAndTime).toDateString(),
    })) || [];

  const donations = {
    total:
      dashboardData.monthlyDonation?.reduce(
        (acc, d) => acc + (d.amount || 0),
        0
      ) || 0,
    count: dashboardData.monthlyDonation?.length || 0,
  };

  return (
    <div className="w-[98%] mx-auto flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="p-3 py-4 rounded-lg flex justify-between items-center cursor-pointer"
            style={{
              // backgroundColor: card.color,
              boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div>
              <h4 className="text-2xl font-bold ">{card.count}</h4>
              <h5 className=" font-medium text-lg">{card.title}</h5>
            </div>
            <div
              className="flex justify-center  bg-white rounded-full h-12 w-12 items-center"
              style={{ backgroundColor: card.color }}
            >
              {/* <Avatar src={card.icon} /> */}
              <img src={card.icon} alt={card.title} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 ">
        {/* Recent Members + Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Recent Members</h3>
            {recentMembers.length > 0 ? (
              <ul className="space-y-3">
                {recentMembers.map((member, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-gray-500 text-sm">{member.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent members found</p>
            )}
          </div>

          <div className="p-5 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {moment(event.dateAndTime).format("DD/MM/YYYY")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Announcements + Donations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-2 p-5 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Latest Announcements</h3>
            {announcements.length > 0 ? (
              <ul className="space-y-3">
                {announcements.map((a, i) => (
                  <li key={i} className="border-b pb-2">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-gray-500">{a.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No announcements yet</p>
            )}
          </div>

          <div className="p-5 bg-white rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Donations Overview</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">
              ${donations.total.toLocaleString()}
            </p>
            <p className="text-gray-500 text-sm mb-3">
              {donations.count} contributions this month
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
