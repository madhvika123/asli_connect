import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { postData } from "../../../api/apiService";
import { MdEdit } from "react-icons/md";
import AddPatient from "./Addpatientmain";

const PatientsMainHospital = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [patientDrawer, setPatientDrawer] = useState(false);
    const [patientsData, setPatientsData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patientRecord, setPatientRecord] = useState(null);
    const [warningModal, setWarningModal] = useState(false);
    const [modalLoad, setModalLoad] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("0");
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState([]);

    const fetchPatientsList = async () => {
        try {
            setLoading(true);
            const payload = {
                page: currentPage,
                pageSize: pageSize,
                search: searchQuery,
                sort: selectedFilter,
            };
            const response = await postData("/api/branch/list-of-patient-for-branch", payload);
            if (response?.responseCode == 200) {
                console.log(response?.data);
                setPatientsData(response?.data || []);
                setTotal(response?.data?.patients?.length || 1);
                setPatients(response?.data?.patients);
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

    const patientChangeStatus = async () => {
        try {
            const payload = {
                patientId: patientRecord?._id,
            };
            setModalLoad(true);
            const response = await postData("/api/admin/toggle-patient", payload);
            if (response?.responseCode == 200) {
                setWarningModal(false);
                message.success(response?.message);
                fetchPatientsList();
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
        fetchPatientsList();
    }, [selectedFilter, currentPage, pageSize, searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

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
            render: (email) => <span className='capitalize'>{email || "N/A"}</span>,
        },

        {
            title: "Date of Birth",
            dataIndex: "dateOfBirth",
            align: "center",
            key: "dateOfBirth",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
        },
        {
            title: "Emergency Contact",
            dataIndex: "emergencyContact",
            align: "center",
            key: "emergencyContact",
        },
        {
            title: "Aadhar Number",
            dataIndex: "aadhaarNumber",
            align: "center",
            key: "aadhaarNumber",
            render: (aadhaarNumber) => <span>{aadhaarNumber || "N/A"}</span>,
        },
        {
            title: "Address",
            dataIndex: "address",
            align: "center",
            key: "address",
            render: (address) => (
                <span className='capitalize'>{address || "N/A"}</span>
            ),
        },
        // {
        //     title: "City",
        //     dataIndex: "city",
        //     align: "center",
        //     key: "city",
        //     render: (city) => <span className='capitalize'>{city || "N/A"}</span>,
        // },
        // {
        //     title: "State",
        //     dataIndex: "state",
        //     align: "center",
        //     key: "state",
        //     render: (state) => <span className='capitalize'>{state || "N/A"}</span>,
        // },
        // {
        //     title: "Country",
        //     dataIndex: "country",
        //     align: "center",
        //     key: "country",
        //     render: (country) => (
        //         <span className='capitalize'>{country || "N/A"}</span>
        //     ),
        // },

        {
            title: "Guardian Name",
            dataIndex: "guardian",
            align: "center",
            key: "guardian",
            render: (guardian) => (
                <span className='capitalize'>{guardian?.name || "N/A"}</span>
            ),
        },
        {
            title: "Guardian Relation",
            dataIndex: "guardian",
            align: "center",
            key: "guardian",
            render: (guardian) => (
                <span className='capitalize'>{guardian?.relation || "N/A"}</span>
            ),
        },
        {
            title: "Registration Date",
            dataIndex: "createdAt",
            align: "center",
            key: "createdAt",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (status, record) => (
                <Switch
                    checked={status === "active"}
                    onChange={(checked) => {
                        setPatientRecord(record);
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
                        setPatientDrawer(true);
                    }}
                    className={`${record?.status === "inactive"
                        ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
                        : ""
                        }`}
                />
            ),
        },
    ];

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
                        {/* <Button
                            type='button'
                            icon={<PlusOutlined />}
                            onClick={() => setPatientDrawer(true)}
                            className='bg-primary text-white h-[36px]'>
                            Add New
                        </Button> */}
                    </div>
                </div>
                <div className='max-h-[80dvh] overflow-y-auto pr-1'>
                    <Table
                        columns={columns}
                        dataSource={patients || []}
                        locale={{ emptyText: "No Patients available" }}
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
                <AddPatient
                    patientDrawer={patientDrawer}
                    setPatientDrawer={setPatientDrawer}
                    fetchPatientsList={fetchPatientsList}
                    editId={editId}
                    setEditId={setEditId}
                />
                <Modal visible={warningModal} footer={null} centered closeIcon={false}>
                    <Spin spinning={modalLoad}>
                        <div className='dashboard m-2'>
                            <h4 className='text-xl font-semibold text-center py-2'>
                                Are you sure you want to{" "}
                                {patientRecord?.status === "active" ? "Deactivate" : "Activate"}{" "}
                                <br /> this patient status
                            </h4>
                            <footer className='flex justify-center items-center pt-2 space-x-4'>
                                <Button
                                    type='default'
                                    onClick={() => {
                                        setPatientRecord(null);
                                        setWarningModal(false);
                                    }}
                                    className='min-w-[100px]'>
                                    No
                                </Button>
                                <Button
                                    type='primary'
                                    className='min-w-[100px]'
                                    onClick={() => patientChangeStatus()}>
                                    Yes
                                </Button>
                            </footer>
                        </div>
                    </Spin>
                </Modal>
            </div>
        </Spin>
    );
};

export default PatientsMainHospital
