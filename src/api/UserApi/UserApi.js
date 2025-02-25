import axios from "../../config/axiosCustom";


export const callCreateResume = (url, companyId, jobId, description) => {
    return axios.post('/resumes', { 
        url, 
        companyId, 
        jobId,
        description 
    });
};

export const callUploadSingleFile = (file, folderType) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file);

    console.log("🔹 Dữ liệu FormData trước khi gửi:");
    for (let pair of bodyFormData.entries()) {
        console.log(pair[0], pair[1]); // Kiểm tra dữ liệu trong FormData
    }

    return axios({
        method: "post",
        url: "/files/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType,
        },
    });
};

export const callActivateAccount = (email, otp) => {
    return axios.post('/auth/active', { email, otp });
};

export const getAppliedJobs = async () => {
    return axios.post('/resumes/by-user');
};

// Trong file UserApi.js
export const callCreateCompany = (name, address, description, logo) => {
    return axios.post('/companies', { 
        name,
        address,
        description,
        logo
    });
};
