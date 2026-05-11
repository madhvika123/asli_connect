import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import AddUser from "./addUser";

const Party = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);

  // const toggleUser

  const userChangeStatus = async () => {
    console.log(selectedRecord);
    setModalLoad(true);

    const payload = {
      partyId: selectedRecord._id,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/toggle-party", payload);
      if (response?.responseCode == 200) {
        setWarningModal(false);
        setSelectedRecord(null);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      s;
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setModalLoad(false);
      fetchUserList();
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Party Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => (
        <span title={name}>
          {name?.slice(0, 25)}
          {name?.length > 25 ? "..." : ""}
        </span>
      ),
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      key: "abbreviation",
      align: "center",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      align: "center",
      render: (symbol) => (
        <img
          src={symbol}
          alt="Party Symbol"
          className="w-12 h-12 object-contain mx-auto rounded"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/50?text=No+Image"; // fallback
          }}
        />
      ),
    },
    {
      title: "Leader",
      dataIndex: "leader",
      key: "leader",
      align: "center",
    },
    {
      title: "Founded",
      dataIndex: "founded",
      key: "founded",
      align: "center",
    },
    {
      title: "MLA Count",
      dataIndex: "mlaCount",
      key: "mlaCount",
      align: "center",
    },
    // {
    //   title: "Constituencies",
    //   dataIndex: "constituencies",
    //   key: "constituencies",
    //   align: "center",
    //   render: (list) =>
    //     list?.length ? list.map((c) => c.name).join(", ") : "N/A",
    // },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   align: "center",
    //   render: (isActive, record) => (
    //     <Switch
    //       checked={isActive}
    //       onChange={() => {
    //         setSelectedRecord(record);
    //         setWarningModal(true);
    //       }}
    //     />
    //   ),
    // },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      isPartyMember: false,
      search: searchQuery,
      sortBy: selectedFilter, /// 1 --- old or 0 -- latest
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/list-of-parties", payload);
      if (response?.responseCode == 200) {
        setUsers((response?.data?.data || []).filter((user) => user.isActive));

        setTotal(response?.data?.pagination?.total || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [selectedFilter, currentPage, pageSize, searchQuery]);

  console.log("users", users);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-1 w-full">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              value={searchInput}
              className="w-[400px]"
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex items-center justify-end gap-1 w-full">
            <TextField
              select
              fullWidth
              size="small"
              label="Sort by Date"
              placeholder="Select sorting order"
              className="max-w-[25%]"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <MenuItem value="0">Newest First</MenuItem>
              <MenuItem value="1">Oldest First</MenuItem>
            </TextField>

            {/* <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setUserModelFlag(true);
              }}
              className="bg-primary text-white h-[36px]"
            >
              Add New
            </Button> */}
          </div>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto pr-1">
          <Table
            columns={columns}
            dataSource={users}
            locale={{ emptyText: "No Users available" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            rowKey={(record) => record._id}
            scroll={{ x: "max-content" }}
          />
        </div>
        <AddUser
          patientDrawer={userModelFlag}
          setPatientDrawer={setUserModelFlag}
          fetchPatientsList={fetchUserList}
          editId={editId}
          setEditId={setEditId}
        />
      </div>

      <Modal visible={warningModal} footer={null} centered closeIcon={false}>
        <Spin spinning={modalLoad}>
          <div className="dashboard m-2">
            <h4 className="text-xl font-semibold text-center py-2">
              Are you sure you want to{" "}
              {selectedRecord?.isActive ? "Deactivate" : "Activate"} <br /> this
              user status
            </h4>
            <footer className="flex justify-center items-center pt-2 space-x-4">
              <Button
                type="default"
                onClick={() => {
                  setSelectedRecord(null);
                  setWarningModal(false);
                }}
                className="min-w-[100px]"
              >
                No
              </Button>
              <Button
                type="primary"
                className="min-w-[100px]"
                onClick={() => userChangeStatus()}
              >
                Yes
              </Button>
            </footer>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
};

export default Party;
