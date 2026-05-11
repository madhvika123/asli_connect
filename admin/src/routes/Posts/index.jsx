import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Spin,
  Tooltip,
  Tag,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { fetchData, patchData, deleteData } from "../../api/apiService";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await fetchData(
        `/api/posts/lists?page=${page}&limit=${pageSize}`
      );

      if (res?.status === 200) {
        setPosts(res.data || []);
        setTotal(res.total || 0);
      } else {
        message.error("Failed to fetch posts");
      }
    } catch {
      message.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, pageSize]);

  /* ================= VIEW POST ================= */
  const viewPost = (record) => {
    Modal.info({
      title: "Post Details",
      width: 600,
      content: (
        <div>
          {record.mediaUrl && (
            <img
              src={record.mediaUrl}
              alt="post"
              style={{ width: "100%", marginBottom: 10 }}
            />
          )}
          <p>{record.caption}</p>
        </div>
      ),
    });
  };

  /* ================= HIDE / UNHIDE ================= */
  const togglePostStatus = async (record) => {
    const newStatus =
      record.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";

    try {
      await patchData(`/api/posts/status/${record._id}`, {
        status: newStatus,
      });

      message.success("Post status updated");
      fetchPosts();
    } catch {
      message.error("Failed to update status");
    }
  };

  /* ================= DELETE POST ================= */
  const deletePost = (record) => {
    Modal.confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete this post?",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteData(`/api/posts/delete/${record._id}`);
          message.success("Post deleted");
          fetchPosts();
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
      render: (_, __, index) =>
        (page - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: "Preview",
      key: "media",
      width: 120,
      render: (_, record) =>
        record.mediaUrl ? (
          <img
            src={record.mediaUrl}
            alt="post"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          "No Media"
        ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      ellipsis: true,
    },
    {
      title: "Posted By",
      dataIndex: ["user", "name"],
      width: 150,
    },
    {
      title: "Likes",
      dataIndex: "likesCount",
      width: 100,
      align: "center",
    },
    {
      title: "Comments",
      dataIndex: "commentsCount",
      width: 110,
      align: "center",
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
          <Tag color="red">Hidden</Tag>
        ),
    },
    {
      title: "Posted On",
      dataIndex: "createdAt",
      width: 150,
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Post">
            <Button
              icon={<EyeOutlined />}
              onClick={() => viewPost(record)}
            />
          </Tooltip>

          <Tooltip title="Hide/Unhide">
            <Button
              icon={
                record.status === "ACTIVE" ? (
                  <StopOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={() => togglePostStatus(record)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => deletePost(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-4">
          Posts List
        </h2>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey="_id"
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
      </div>
    </Spin>
  );
};

export default Posts;
