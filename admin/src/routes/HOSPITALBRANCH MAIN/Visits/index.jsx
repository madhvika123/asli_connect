import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined  ,  EyeOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
// import AddDoctor from "./AddDoctor";
import { PiGitBranchFill } from "react-icons/pi";
import { visitsData } from "./visits.jsonObject";
import AddVisit from "./AddVisit";
import AddBranchPatient from "./AddBranchPatient";

const VisitsBranch  = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [visitDrawer, setVisitDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctorData, setDoctorData] = useState({});
  const [visitRecord, setVisitRecord] = useState(null);
  const [warningModal, setWarningModal] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [editId, setEditId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  //   const [visitsData, setVisitsData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [branchData, setBranchData] = useState([]);
  const [branchPatientModal, setBranchPatientModal] = useState(false);
  const [patientsData, setPatientsData] = useState([]);
  const [visitsData, setVisitsData] = useState([]);


  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [selectedVitals, setSelectedVitals] = useState(null);

  console.log(visitsData);

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Visit ID",
      dataIndex: "visitId",
      key: "visitId",
      align: "center",
      render: (visitId) => <span>{visitId || "N/A"}</span>,
    },
    {
      title: "Patient Name",
      dataIndex: ["patient", "name"],
      key: "patientName",
      align: "center",
      render: (_, record) => (
        <span className='capitalize'>{record?.patient?.name || "N/A"}</span>
      ),
    },
    {
      title: "Gender",
      dataIndex: ["patient", "gender"],
      key: "gender",
      align: "center",
      render: (_, record) => (
        <span className='capitalize'>{record?.patient?.gender || "N/A"}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: ["patient", "phone"],
      key: "phone",
      align: "center",
      render: (_, record) => <span>{record?.patient?.phone || "N/A"}</span>,
    },
    {
      title: "Doctor Name",
      dataIndex: ["doctor", "name"],
      key: "doctorName",
      align: "center",
      render: (_, record) => (
        <span className='capitalize'>{record?.doctor?.name || "N/A"}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "Department",
      align: "center",
      render: (_, record) => <span>{record?.department || "N/A"}</span>,
    },
    {
      title: "Consultation Fee",
      dataIndex: ["doctor", "consultationFee"],
      key: "consultationFee",
      align: "center",
      render: (_, record) => (
        <span>{record?.doctor?.consultationFee || "N/A"}</span>
      ),
    },
    {
      title: "Visit Type",
      dataIndex: "visitType",
      key: "visitType",
      align: "center",
      render: (visitType) => (
        <span className='capitalize'>{visitType || "N/A"}</span>
      ),
    },
    {
      title: "Visit Date & Time",
      dataIndex: "visitDateTime",
      key: "visitDateTime",
      align: "center",
      render: (visitDateTime) =>
        visitDateTime
          ? moment(visitDateTime).format("DD/MM/YYYY hh:mm A")
          : "N/A",
    },
    {
      title: "Branch Name",
      dataIndex: ["branch", "branchName"],
      key: "branchName",
      align: "center",
      render: (_, record) => <span>{record?.branch?.branchName || "N/A"}</span>,
    },
    {
      title: "Complaints",
      dataIndex: "complaints",
      key: "complaints",
      align: "center",
      render: (complaints) => <span>{complaints || "N/A"}</span>,
    },
    // Separate Vitals Columns
    // {
    //   title: "BP",
    //   dataIndex: ["vitals", "bp"],
    //   key: "bp",
    //   align: "center",
    //   render: (_, record) => <span>{record?.vitals?.bp || "N/A"}</span>,
    // },
    // {
    //   title: "Temp (°F)",
    //   dataIndex: ["vitals", "temp"],
    //   key: "temp",
    //   align: "center",
    //   render: (_, record) => <span>{record?.vitals?.temp || "N/A"}</span>,
    // },
    // {
    //   title: "Pulse (bpm)",
    //   dataIndex: ["vitals", "pulse"],
    //   key: "pulse",
    //   align: "center",
    //   render: (_, record) => <span>{record?.vitals?.pulse || "N/A"}</span>,
    // },
    // {
    //   title: "Weight (kg)",
    //   dataIndex: ["vitals", "weight"],
    //   key: "weight",
    //   align: "center",
    //   render: (_, record) => <span>{record?.vitals?.weight || "N/A"}</span>,
    // },
    // {
    //   title: "Height (cm)",
    //   dataIndex: ["vitals", "height"],
    //   key: "height",
    //   align: "center",
    //   render: (_, record) => <span>{record?.vitals?.height || "N/A"}</span>,
    // },
    {
      title: "Vitals",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedVitals(record.vitals);
            setVitalsModalVisible(true);
          }}
          disabled={!record.vitals}
        >
          View Vitals
        </Button>
      ),
    },
    {
      title: "Registered On",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (_, record) =>
        record?.createdAt
          ? moment(record.createdAt).format("DD/MM/YYYY")
          : "N/A",
    },
  ];

  const fetchPatientsList = async () => {
    const payload = {
      search: "", // name , phone
      sort: -1, // 1 for old, -1 for new
      page: 1,
      pageSize: 50,
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/branch/list-of-patient-for-branch",
        payload
      );
      if (response?.responseCode == 200) {
        setPatientsData(response?.data?.patients || []);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch patients List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsList();
  }, []);

  const fetchVisitsList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery,
      sort: selectedFilter, /// 1 --- old or 0 -- latest
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/branch/list-of-visits-by-branch",
        payload
      );
      if (response?.responseCode == 200) {
        setVisitsData(response?.data?.visits || []);
        setTotal(response?.data?.totalVisit || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch visits List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitsList();
  }, [selectedFilter, currentPage, pageSize, searchQuery]);

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
              <MenuItem value='0'>Newest First</MenuItem>
              <MenuItem value='1'>Oldest First</MenuItem>
            </TextField>

            <Button
              type='button'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setVisitDrawer(true);
              }}
              className='bg-primary text-white h-[36px]'>
              Add New
            </Button>
          </div>
        </div>
        <div className='max-h-[80dvh] overflow-y-auto pr-1'>
          <Table
            columns={columns}
            dataSource={visitsData}
            locale={{ emptyText: "No visits available" }}
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
                {visitRecord?.status === "active" ? "Deactivate" : "Activate"}{" "}
                <br /> this doctor status
              </h4>
              <footer className='flex justify-center items-center pt-2 space-x-4'>
                <Button
                  type='default'
                  onClick={() => {
                    setVisitRecord(null);
                    setWarningModal(false);
                  }}
                  className='min-w-[100px]'>
                  No
                </Button>
                <Button
                  type='primary'
                  className='min-w-[100px]'
                //   onClick={() => doctorChangeStatus()}
                >
                  Yes
                </Button>
              </footer>
            </div>
          </Spin>
        </Modal>

        <Modal
          visible={branchPatientModal}
          footer={null}
          centered
          closeIcon={false}>
          <AddBranchPatient
            branchPatientModal={branchPatientModal}
            setBranchPatientModal={setBranchPatientModal}
            fetchPatientsList={fetchPatientsList}
          />
        </Modal>

        <Modal
          title="Patient Vitals"
          visible={vitalsModalVisible}
          onCancel={() => setVitalsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setVitalsModalVisible(false)}>
              Close
            </Button>
          ]}
          centered
        >
          {selectedVitals ? (
            <div className="vitals-details">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Blood Pressure:</strong>
                  <p>{selectedVitals.bp || "N/A"}</p>
                </div>
                <div>
                  <strong>Temperature (°F):</strong>
                  <p>{selectedVitals.temp || "N/A"}</p>
                </div>
                <div>
                  <strong>Pulse (bpm):</strong>
                  <p>{selectedVitals.pulse || "N/A"}</p>
                </div>
                <div>
                  <strong>Weight (kg):</strong>
                  <p>{selectedVitals.weight || "N/A"}</p>
                </div>
                <div>
                  <strong>Height (cm):</strong>
                  <p>{selectedVitals.height || "N/A"}</p>
                </div>
                {/* <div>
                  <strong>BMI:</strong>
                  <p>{selectedVitals.bmi || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <strong>Additional Notes:</strong>
                  <p>{selectedVitals.notes || "No additional notes"}</p>
                </div> */}
              </div>
            </div>
          ) : (
            <p>No vitals data available</p>
          )}
        </Modal>

        <AddVisit
          visitDrawer={visitDrawer}
          setVisitDrawer={setVisitDrawer}
          fetchVisitsList={fetchVisitsList}
          editId={editId}
          setEditId={setEditId}
          patientsData={patientsData}
          setPatientsData={setPatientsData}
          branchPatientModal={branchPatientModal}
          setBranchPatientModal={setBranchPatientModal}
        />
      </div>
    </Spin>
  );
};

export default VisitsBranch;
