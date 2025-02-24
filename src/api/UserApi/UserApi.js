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
    bodyFormData.append('fileUpload', file);

    return axios({
        method: 'post',
        url: '/files/upload',
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

export const getAppliedJobs = async () => {
    return axios.post('/resumes/by-user');
};

export const callCreateCompany = (name, address, description, logo, token) => {
    return axios.post(
      "/companies",
      { name, address, description, logo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };