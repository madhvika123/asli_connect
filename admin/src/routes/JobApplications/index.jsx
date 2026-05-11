import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Modal,
  message,
  Spin,
  Tooltip,
  Tag,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { fetchData, patchData, deleteData } from "../../api/apiService";
// import EditJob from "./EditJob"; // create this drawer/page if needed

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editDrawer, setEditDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await fetchData(
        `/api/jobs/lists?page=${page}&limit=${pageSize}`
      );

      if (res?.status === 200) {
        setJobs(res.data || []);
        setTotal(res.total || 0);
      } else {
        message.error("Failed to fetch jobs");
      }
    } catch {
      message.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  /* ================= VIEW JOB ================= */
  const viewJob = (record) => {
    Modal.info({
      title: "Job Details",
      width: 600,
      content: (
        <div>
          <p><b>Title:</b> {record.title}</p>
          <p><b>Company:</b> {record.company}</p>
          <p><b>Location:</b> {record.location}</p>
          <p><b>Salary:</b> {record.salary}</p>
          <p><b>Description:</b></p>
          <p>{record.description}</p>
        </div>
      ),
    });
  };

  /* ================= ACTIVATE / DEACTIVATE ================= */
  const toggleStatus = async (record) => {
    const newStatus =
      record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await patchData(`/api/jobs/status/${record._id}`, {
        status: newStatus,
      });

      message.success("Job status updated");
      fetchJobs();
    } catch {
      message.error("Failed to update status");
    }
  };

  /* ================= DELETE JOB ================= */
  const deleteJob = (record) => {
    Modal.confirm({
      title: "Delete Job",
      content: (
        <>
          Are you sure you want to delete <b>{record.title}</b>?
        </>
      ),
      okType: "danger",
      onOk: async () => {
        try {
          await deleteData(`/api/jobs/delete/${record._id}`);
          message.success("Job deleted");
          fetchJobs();
        } catch {
          message.error("Delete failed");
        }
      },
    });
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "S.No",
      width: 70,
      align: "center",
      render: (_, __, index) =>
        (page - 1) * pageSize + index + 1,
    },
    {
      title: "Job Title",
      dataIndex: "title",
      width: 180,
    },
    {
      title: "Company",
      dataIndex: "company",
      width: 160,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 150,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      width: 130,
      align: "center",
      render: (salary) => salary || "Not Disclosed",
    },
    {
      title: "Applicants",
      dataIndex: "applicantsCount",
      width: 120,
      align: "center",
      render: (val) => val || 0,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) =>
        status === "ACTIVE" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 150,
      align: "center",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      width: 220,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Job Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => viewJob(record)}
            />
          </Tooltip>

          <Tooltip title="Edit Job">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedJob(record);
                setEditDrawer(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Activate / Deactivate">
            <Switch
              checked={record.status === "ACTIVE"}
              onChange={() => toggleStatus(record)}
            />
          </Tooltip>

          <Tooltip title="Delete Job">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteJob(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Jobs List</h2>
        </div>

        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="_id"
          scroll={{ x: 1500, y: 450 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />

        {/* Job Edit Drawer / Modal */}
        {/* 
        <EditJob
          open={editDrawer}
          setOpen={setEditDrawer}
          job={selectedJob}
          fetchJobs={fetchJobs}
        />
        */}
      </div>
    </Spin>
  );
};

export default Jobs;
