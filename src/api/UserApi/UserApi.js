import axios from "../axiosCustom";

export const callCreateResume = (url, companyId, jobId) => {
    return axios.post('/api/v1/resumes', { url, companyId, jobId });
};

export const callUploadSingleFile = (file, folderType) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', file);
    
    return axios({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folderType
        },
    });
};

export const callActivateAccount = (email, otp) => {
    return axios.post('/auth/active', { email, otp });
};