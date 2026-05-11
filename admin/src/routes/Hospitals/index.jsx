import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddHospital from "./AddHospital";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit } from "react-icons/md";

const Hospitals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [hospitalDrawer, setHospitalDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [hospitalRecord, setHospitalRecord] = useState(null);
  const [warningModal, setWarningModal] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      rowScope: "row",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      key: "name",
      render: (name) => <span className='capitalize'>{name || "N/A"}</span>,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      align: "center",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      key: "email",
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      align: "center",
      key: "registrationDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },

    {
      title: "Address",
      dataIndex: "address",
      align: "center",
      key: "address",
      render: (_, record) => {
        const address = record.address || "N/A";
        const latitude = record.location?.coordinates?.[0] || "";
        const longitude = record.location?.coordinates?.[1] || "";

        return (
          <span
            className='capitalize text-blue-500 cursor-pointer underline'
            onClick={() => {
              if (latitude && longitude && address) {
                const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                window.open(url, "_blank");
              } else {
                message.warning("Coordinates not available");
              }
            }}>
            {address}
          </span>
        );
      },
    },
    // {
    //   title: "City",
    //   dataIndex: "city",
    //   align: "center",
    //   key: "city",
    //   render: (city) => <span className='capitalize'>{city || "N/A"}</span>,
    // },
    // {
    //   title: "State",
    //   dataIndex: "state",
    //   align: "center",
    //   key: "state",
    //   render: (state) => <span className='capitalize'>{state || "N/A"}</span>,
    // },
    {
      title: "GSTIN",
      dataIndex: "GSTIN",
      align: "center",
      key: "GSTIN",
      render: (GSTIN) => <span className='capitalize'>{GSTIN || "N/A"}</span>,
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
      align: "center",
      key: "groupName",
      render: (groupName) => (
        <span className='capitalize'>{groupName || "N/A"}</span>
      ),
    },
    {
      title: "Admin Details",
      dataIndex: "contactPerson",
      key: "contactPerson",
      align: "center",
      render: (_, record) => {
        const name = record.contactPersonName || "N/A";
        const phone = record.contactPersonPhone || "N/A";
        return (
          <div className='flex items-center justify-center gap-3'>
            <div className='capitalize font-medium'>{name}</div>|
            <div className='text-sm text-gray-500'>{phone}</div>
          </div>
        );
      },
    },

    // {
    //   title: "Website",
    //   dataIndex: "website",
    //   align: "center",
    //   key: "website",
    //   render: (website) =>
    //     website ? (
    //       <a
    //         href={website.startsWith("http") ? website : `https://${website}`}
    //         target='_blank'
    //         rel='noopener noreferrer'
    //         className='text-blue-600 underline cursor-pointer'>
    //         {website}
    //       </a>
    //     ) : (
    //       <span>N/A</span>
    //     ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={(checked) => {
            setHospitalRecord(record);
            setWarningModal(true);
          }}
        />
      ),
    },
    {
      title: "Action",
      align: "center",
      key: "edit",
      render: (_, record) => (
        <Button
          type='button'
          disabled={record?.status === "inactive"}
          icon={<MdEdit className='text-lg' />}
          onClick={() => {
            setEditId(record?._id);
            setHospitalDrawer(true);
          }}
          className={`${
            record?.status === "inactive"
              ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
              : ""
          }`}
        />
      ),
    },
  ];

  const fetchHospitalsList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery,
      sort: selectedFilter,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/list-of-hospitals", payload);
      if (response?.responseCode == 200) {
        setHospitalsData(response?.data || []);
        setHospitals(response?.data?.hospitals || []);
        setTotal(response?.data?.totalHospital || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch hospitals List");
    } finally {
      setLoading(false);
    }
  };

  const hospitalChangeStatus = async () => {
    try {
      const payload = {
        hospitalId: hospitalRecord?._id,
      };
      setModalLoad(true);
      const response = await postData("/api/admin/toggle-hospital", payload);
      if (response?.responseCode == 200) {
        setWarningModal(false);
        fetchHospitalsList();
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to change the status");
    } finally {
      setModalLoad(false);
    }
  };

  useEffect(() => {
    fetchHospitalsList();
  }, [searchQuery, pageSize, currentPage, selectedFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  return (
    <Spin spinning={loading}>
      <div className='mt-2 flex flex-col gap-2'>
        <div className='flex items-center justify-between client-details-form'>
          <TextField
            id='outlined-basic'
            label='Search'
            variant='outlined'
            size='small'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type='search'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchOutlined className='search-icon' />
                </InputAdornment>
              ),
            }}
          />
          <div className='flex items-center justify-end gap-1 w-full'>
            <TextField
              select
              fullWidth
              size='small'
              label='Sort by Date'
              placeholder='Select sorting order'
              className='max-w-[25%]'
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}>
              <MenuItem value='-1'>Newest First</MenuItem>
              <MenuItem value='1'>Oldest First</MenuItem>
            </TextField>
            <Button
              type='button'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setHospitalDrawer(true);
              }}
              className='bg-primary text-white h-[36px]'>
              Add New
            </Button>
          </div>
        </div>
        <div className='max-h-[80dvh] overflow-y-auto pr-1'>
          <Table
            columns={columns}
            dataSource={hospitals}
            locale={{ emptyText: "No hospitals available" }}
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
        <Modal visible={warningModal} footer={null} centered closeIcon={false}>
          <Spin spinning={modalLoad}>
            <div className='dashboard m-2'>
              <h4 className='text-xl font-semibold text-center py-2'>
                Are you sure you want to{" "}
                {hospitalRecord?.status === "active"
                  ? "Deactivate"
                  : "Activate"}{" "}
                <br /> this hospital status
              </h4>
              <footer className='flex justify-center items-center pt-2 space-x-4'>
                <Button
                  type='default'
                  onClick={() => {
                    setHospitalRecord(null);
                    setWarningModal(false);
                  }}
                  className='min-w-[100px]'>
                  No
                </Button>
                <Button
                  type='primary'
                  className='min-w-[100px]'
                  onClick={() => hospitalChangeStatus()}>
                  Yes
                </Button>
              </footer>
            </div>
          </Spin>
        </Modal>
        <AddHospital
          hospitalDrawer={hospitalDrawer}
          setHospitalDrawer={setHospitalDrawer}
          fetchHospitalsList={fetchHospitalsList}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
    </Spin>
  );
};

export default Hospitals;
