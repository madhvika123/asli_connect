import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Upload,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { handleUpload } from "../../utils/FileUpload";
import { postData, putData, fetchData } from "../../api/apiService";

const { Option } = Select;
const { TextArea } = Input;

const AddLokVartha = ({
  patientDrawer,
  setPatientDrawer,
  fetchPatientsList,
  editId = null,
  setEditId,
  data,
  mediaType = "PressRelease",
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editData, setEditData] = useState(null);

  // 🧾 Handle form submission
  const onFinish = async (values) => {
    const payload = {
      title: values.title?.trim(),
      publishDate: values.publishDate
        ? values.publishDate.format("YYYY-MM-DD")
        : null,
      status: values.status,
      mediaType,
      content: values.content?.trim(),
      images: values.images
        ? await Promise.all(
            values.images.map(async (file) => {
              if (file.url) return file.url;
              if (file.originFileObj)
                return await handleUpload(file.originFileObj);
              return null;
            })
          )
        : [],
      videoUrl: values.videoUrl || "",
      url: values.url || "",
    };

    try {
      setLoading(true);
      let response;

      if (editId) {
        payload.id = editId;
      }

      // Create new news
      response = await postData("/api/mla/create-media", payload);

      if (response?.responseCode === 200) {
        message.success(response?.message || "Saved successfully!");
        setPatientDrawer(false);
        setEditId(null);
        fetchPatientsList?.();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to save LokVartha data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editId && data) {
      form.setFieldsValue({
        ...data,
        publishDate: data.publishDate ? dayjs(data.publishDate) : null,
        images: data.images
          ? data.images.map((url, index) => ({
              uid: index,
              name: `image_${index + 1}`,
              status: "done",
              url,
            }))
          : [],
      });
      setEditData(data);
    } else {
      form.resetFields();
      setEditData(null);
    }
  }, [editId, patientDrawer]);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Drawer
      open={patientDrawer}
      closable={true}
      title={
        <h3 className="text-xl text-center text-black font-semibold ">
          {editId ? "Update" : "Add"} {mediaType}
        </h3>
      }
      footer={null}
      maskClosable={true}
      placement="right"
      width={600}
      extra={
        <CloseOutlined
          onClick={() => {
            setEditId(null);
            setPatientDrawer(false);
          }}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className="custom-drawer"
      onClose={() => {
        setEditId(null);
        setPatientDrawer(false);
      }}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              {/* Title */}
              <Form.Item
                label="Event Title *"
                name="title"
                initialValue={editData?.title || ""}
                rules={[
                  { required: true, message: "Please enter event title" },
                  {
                    pattern: /^[A-Za-z ]+$/,
                    message: "Only alphabets and spaces are allowed",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Event Title"
                  onChange={(e) => {
                    const onlyText = e.target.value.replace(/[^A-Za-z ]/g, "");
                    form.setFieldsValue({ title: onlyText });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Publish Date */}
              <Form.Item
                label="Publish Date *"
                name="publishDate"
                rules={[
                  { required: true, message: "Please select a publish date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          {/* Status */}
          <Form.Item
            label="Status *"
            name="status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
            </Select>
          </Form.Item>

          {/* Content */}
          <Form.Item
            label="Content *"
            name="content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <TextArea rows={5} placeholder="Enter article content" />
          </Form.Item>

          {/* Images */}
          {mediaType !== "Videos" && (
            <Form.Item
              label="Image Gallery *"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: "Please upload at least one image" },
              ]}
            >
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={() => false}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload *</div>
                </div>
              </Upload>
            </Form.Item>
          )}

          <Row gutter={16}>
            {mediaType !== "PressRelease" && mediaType !== "PhotoGallery" && (
              <Col span={12}>
                {/* Video URL (only for non-PressRelease types) */}
                <Form.Item
                  label="Video URL *"
                  name="videoUrl"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a video URL",
                    },
                    {
                      type: "url",
                      message: "Please enter a valid video URL",
                    },
                  ]}
                >
                  <Input placeholder="Enter YouTube or other video URL *" />
                </Form.Item>
              </Col>
            )}

            {mediaType !== "Videos" && mediaType !== "PhotoGallery" && (
              <Col span={12}>
                {/* Article URL (mandatory for PressRelease) */}
                <Form.Item
                  label="Article URL *"
                  name="url"
                  rules={[
                    {
                      required: true,
                      message: "Article URL is required",
                    },
                    {
                      type: "url",
                      message: "Please enter a valid article URL",
                    },
                  ]}
                >
                  <Input placeholder="Enter article URL *" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <div className="spacediv mt-6 text-right">
            {/* Submit Button */}
            <Form.Item>
              <Space>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploading || loading}
                >
                  {editId ? "Update *" : "Submit *"}
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default AddLokVartha;