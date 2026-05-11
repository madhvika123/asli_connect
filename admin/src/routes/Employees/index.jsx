import React, { useState } from "react";
import employeesData from "./docapp.admins.json";
import moment from "moment";
import { Button, Modal, Table } from "antd";
import { InputAdornment, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const Employees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(employeesData?.length || 1);
  const [searchInput, setSearchInput] = useState("");
  const [employeeModal, setEmployeeModal] = useState(false);

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "_id",
      align: "center",
      key: "_id",
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      align: "center",
      key: "createdAt",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY") : "Not Available",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      align: "center",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      key: "role",
      render: (role) => <p className='capitalize'>{role}</p>,
    },
  ];

  return (
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
        <Button
          type='button'
          icon={<PlusOutlined />}
          onClick={() => setEmployeeModal(true)}
          className='bg-primary text-white h-[36px]'>
          Add New
        </Button>
      </div>
      <div className='max-h-[80dvh] overflow-y-auto pr-1'>
        <Table
          columns={columns}
          dataSource={employeesData}
          locale={{ emptyText: "No Employees available" }}
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
      {/* <Modal
        title={<h3 className='text-xl text-center text-black'>Add Hospital</h3>}
        centered
        visible={hospitalModal}
        onCancel={() => {
          setHospitalModal(false);
        }}
        footer={null}>
        <AddHospital setHospitalModal={setHospitalModal} />
      </Modal> */}
    </div>
  );
};

export default Employees;
