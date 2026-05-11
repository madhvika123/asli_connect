import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Table,
  Tag,
  Button,
  Drawer,
  Input,
  List,
  Space,
  Spin,
  message,
  Upload,
  Slider,
} from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import LocationSearchMui from "../../utils/location";
import { handleUpload } from "../../utils/FileUpload";

const NearestPartyMember = () => {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [area, setArea] = useState("");
  const [addressObject, setAddressObject] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeMember, setActiveMember] = useState(null);
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [radius, setRadius] = useState(100);
  const userId = localStorage.getItem("userId");

  // You can replace this with the actual logged-in MLA's ID from auth
  const mlaId = userId;

  /** 🔹 Fetch all messages for selected Party Member */
  const fetchMessages = async (partyMemberId) => {
    try {
      setLoading(true);
      const res = await postData("/api/mla/get-messages", {
        partyMemberId: partyMemberId,
        recipientType: "PartyMember",
      });
      if (res.responseCode === 200) {
        setMessages(res.data.messagesDetails || []);
      } else {
        message.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  // get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  /** 🔹 Open drawer and load messages */
  const showChat = async (member) => {
    setActiveMember(member);
    setOpen(true);
    await fetchMessages(member?.partyMemberDetails?._id);
  };

  /** 🔹 Send a new message to backend */
  const sendMessage = async () => {
    if ((!input.trim() && (!images || images.length === 0)) || !activeMember)
      return;

    const newMessage = input.trim();

    // Optimistic message: show local previews
    const tempMsg = {
      sender: { _id: mlaId },
      receiver: { _id: activeMember?.partyMemberDetails?._id },
      senderModel: "MLA",
      receiverModel: "PartyMember",
      message: newMessage,
      date: new Date().toISOString(), // ✅ Use ISO string
      isSent: true,
      documents:
        images?.map(
          (file) => file.url || URL.createObjectURL(file.originFileObj)
        ) || [],
      pending: true, // flag to identify placeholder
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInput("");
    setImages([]);
    setSending(true);

    try {
      // Upload images to get real URLs
      const uploadedImages = images?.length
        ? await Promise.all(
            images.map(async (file) => {
              if (file.url) return file.url;
              if (file.originFileObj)
                return await handleUpload(file.originFileObj);
              return null;
            })
          )
        : [];

      // Send message to backend
      const savedMessage = await postData("/api/mla/send-mla-message", {
        receiverId: activeMember?.partyMemberDetails?._id,
        messagesDetails: {
          message: newMessage,
          documents: uploadedImages,
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to send message");
      setMessages((prev) => prev.filter((m) => m !== tempMsg));
      // rollback placeholder
    } finally {
      setSending(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Latitude",
      dataIndex: ["location", "coordinates", 1],
      key: "latitude",
      render: (_, record) => record.location?.coordinates?.[1] ?? "-",
    },
    {
      title: "Longitude",
      dataIndex: ["location", "coordinates", 0],
      key: "longitude",
      render: (_, record) => record.location?.coordinates?.[0] ?? "-",
    },
    {
      title: "Distance (km)",
      dataIndex: "distance",
      key: "distance",
      render: (text) => `${(text / 1000).toFixed(2)} km`,
    },
    {
      title: "Status",
      dataIndex: ["partyMemberDetails", "status"],
      key: "status",
      render: (status) => (
        <Tag color={status === "approved" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showChat(record)}>
          Chat
        </Button>
      ),
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const payload = {
        coordinates: [longitude, latitude],
        // coordinates: [77.0564, 30.6576],
        page: currentPage,
        pageSize: pageSize,
        radius: radius,
      };
      const response = await postData(
        "/api/mla/nearest-party-member-by-mla",
        payload
      );

      if (response.responseCode !== 200) {
        message.error("Failed to fetch users");
        setLoading(false);
        return;
      }

      setUsers(response.data?.partyMember);
      setTotal(response.data?.totalPartyMember);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchUsers();
    }
  }, [currentPage, pageSize, latitude, longitude, radius]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-1 w-full">
            <LocationSearchMui
              value={address}
              onChange={(value) => {
                setAddress(value);
              }}
              initialValue={address}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setArea={setArea}
              setAddress={setAddress}
              setAddressObject={setAddressObject}
            />
            {/* radius:{" "} */}
          </div>
          <div className="flex items-center justify-end gap-1 w-full">
            <div className="flex items-center gap-3 p-0 px-2 rounded-1xl border w-[280px] bg-white shadow-sm">
              <span className="font-semibold text-gray-800 w-[70px] text-right">
                {radius} km
              </span>

              <Slider
                min={10}
                max={5000}
                value={radius}
                onChange={(value) => setRadius(value)}
                className="custom-radius-slider flex-1"
              />
            </div>
            {/* <TextField
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
            </TextField> */}

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
      </div>
      <Drawer
        title={`Chat with ${activeMember?.name || ""}`}
        placement="right"
        width={400}
        onClose={() => {
          setOpen(false);
          setMessages([]);
          setInput("");
          setImageFile(null);
        }}
        open={open}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 100,
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px",
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <List
                dataSource={[...(messages || [])].sort(
                  (a, b) => new Date(a.date) - new Date(b.date)
                )}
                renderItem={(msg, i) => {
                  const isSent = msg.isSent === true;
                  return (
                    <List.Item
                      key={msg._id || i}
                      style={{
                        justifyContent: isSent ? "flex-end" : "flex-start",
                        border: "none",
                        padding: "4px 0",
                      }}
                    >
                      <div
                        style={{
                          background: isSent ? "#1677ff" : "#e4e6eb",
                          color: isSent ? "#fff" : "#000",
                          borderRadius: "15px",
                          padding: "8px 12px",
                          maxWidth: "70%",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.message && <div>{msg.message}</div>}
                        {msg.documents && msg.documents.length > 0 && (
                          <div
                            style={{
                              marginTop: 5,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 8,
                            }}
                          >
                            {msg.documents.map((imgUrl, idx) => (
                              <div
                                key={idx} // move key to the wrapper div
                                style={{
                                  background: "#fff",
                                  padding: 4, // optional padding around image
                                  borderRadius: 10, // match the image border radius
                                  display: "inline-block", // so multiple images wrap nicely
                                }}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`attachment-${idx}`}
                                  style={{
                                    maxWidth: "100%",
                                    width: "120px",
                                    height: "auto",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => window.open(imgUrl, "_blank")}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "10px",
                            color: isSent ? "#d1e3ff" : "#555",
                            textAlign: isSent ? "right" : "left",
                            marginTop: "4px",
                          }}
                        >
                          {msg.date
                            ? new Date(msg.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
              <div ref={messagesEndRef} />
            </div>

            {/* Input, Upload, and Send */}
            <Space.Compact style={{ width: "100%" }}>
              <Upload
                accept="image/*"
                multiple
                listType="picture"
                fileList={images}
                onChange={({ fileList }) => setImages(fileList)}
                beforeUpload={() => false} // prevent auto upload
              >
                <Button icon={<UploadOutlined />}>Attach</Button>
              </Upload>
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={sendMessage}
                disabled={sending}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                loading={sending}
              >
                Send
              </Button>
            </Space.Compact>

            {imageFile && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  style={{ height: 60, borderRadius: 8 }}
                />
                <Button
                  size="small"
                  type="text"
                  danger
                  onClick={() => setImageFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </Spin>
  );
};

export default NearestPartyMember;
