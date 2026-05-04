import React, { useState } from "react";
import PageMeta from "../../common/PageMeta";
import { ROUTES, TITLES } from "../../app/constants";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import ReactQuill from "react-quill";
import Tabs from "../../common/tabs/Tabs";
import CustomerInfoTab from "../users/section/customer/tabs/CustomerInfoTab";
import ReusableTabTable  from "../users/section/customer/tabs/ReusableTabTable";
const validationSchema = Yup.object().shape({
    media: Yup.mixed()
        .required("Media is required")
        .test(
            "fileType",
            "Only JPG, JPEG, PNG, GIF, MP4, WEBM, and MP3/WAV files are allowed",
            (value) => {
                if (!value || !(value instanceof File)) return true;
                const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "video/mp4",
                    "video/webm",
                    "audio/mpeg",
                    "audio/wav",
                ];
                return allowedTypes.includes(value.type);
            }
        )
        .test("fileSize", "File size must be less than 10MB", (value) => {
            if (!value || !(value instanceof File)) return true;
            return value.size <= 10 * 1024 * 1024;
        }),
    pdf: Yup.mixed()
        .nullable()
        .test("pdfType", "Only PDF files are allowed", (value) => {
            if (!value || !(value instanceof File)) return true;
            return value.type === "application/pdf";
        })
        .test("fileSize", "PDF must be less than 10MB", (value) => {
            if (!value || !(value instanceof File)) return true;
            return value.size <= 10 * 1024 * 1024;
        }),
    // media: Yup.mixed()
    //   .test("mediaOrPdf", "Either media or PDF is required", function (media) {
    //     const { pdf } = this.parent;
    //     return media instanceof File || pdf instanceof File;
    //   })
    //   .test("fileType", "Invalid media type", (value) => {
    //     if (!value) return true;
    //     const allowedTypes = [
    //       "image/jpeg",
    //       "image/jpg",
    //       "image/png",
    //       "image/gif",
    //       "video/mp4",
    //       "video/webm",
    //       "audio/mpeg",
    //       "audio/wav",
    //     ];
    //     return allowedTypes.includes(value.type);
    //   })
    //   .test("fileSize", "Media must be less than 10MB", (value) => {
    //     if (!value) return true;
    //     return value.size <= 10 * 1024 * 1024;
    //   }),

    // pdf: Yup.mixed()
    //   .test("mediaOrPdf", "Either media or PDF is required", function (pdf) {
    //     const { media } = this.parent;
    //     return pdf instanceof File || media instanceof File;
    //   })
    //   .test("pdfType", "Only PDF files are allowed", (value) => {
    //     if (!value) return true;
    //     return value.type === "application/pdf";
    //   })
    //   .test("fileSize", "PDF must be less than 10MB", (value) => {
    //     if (!value) return true;
    //     return value.size <= 10 * 1024 * 1024;
    //   }),
    name: Yup.string().required("Topic name is required"),
    lesson: Yup.string().required("Lesson is required"),
    description: Yup.string().required("Description is required"),
});

const options = [
    { value: "1", label: "Communication and Language Skills" },
    { value: "2", label: "Social and Emotional Development" },
    { value: "3", label: "Motor Skills Development" },
    { value: "4", label: "Cognitive and Sensory Exploration" },
];

function EditBannerComponent({
    showEditModal,
    setShowEditModal,
    userDetails,
    userListCallBack, }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const tabsData = [
        { id: "Profile_Info", name: "Profile Info", roleId: "" },
        { id: "Booking_History", name: "Booking History", roleId: "" },
        { id: "Wallet_Transactions", name: "Wallet Transactions", roleId: "STUDENT" },
        { id: "Ratings_Given", name: "Ratings_Given", roleId: "PARENT" },
    ];
    const [activeTab, setActiveTab] = useState("Profile_Info");
    const [mediaPreview, setMediaPreview] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [roleId, setRoleId] = useState("");
    const handleToggle = () => {
        setIsChecked((prev) => !prev);
    };
    const handleChangeUserTab = (id, roleId) => {
        setActiveTab(id);
        setRoleId(roleId);
    };

    const onSubmit = (data) => {
        console.log("Submitted data:", data);
        reset();
    };

    return (
        <>
            <PageMeta title={TITLES?.USERS.customer_Info} description="Dashboard" />
            <Tabs
                tabsData={tabsData}
                activeTab={activeTab}
                handleChangeUserTab={handleChangeUserTab}
            />
            {activeTab === `Profile_Info` ? <CustomerInfoTab /> : <ReusableTabTable activeTab={activeTab} />}
        </>
    );
}

export default EditBannerComponent;
