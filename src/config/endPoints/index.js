export const BASEURL = import.meta.env.VITE_APP_API_URL;
export const FILEURL = `https://souq-syria-app.s3.eu-north-1.amazonaws.com/uploads/`
// export const FILEURL = `https://souq-syria-app.s3.eu-north-1.amazonaws.com`


export const PREFIX = "/auth";

export const AUTH = {
  LOGIN: `${BASEURL}${PREFIX}/admin-login`,
  UPDATE_PASSWORD: `${BASEURL}/admin/change-password`,

  // LOGIN: `${BASEURL}${PREFIX}/login`,
  LOGOUT: `${BASEURL}${PREFIX}/logout`,
  FORGOT_PASSWORD: `${BASEURL}${PREFIX}/forgot-password`,
  VERIFY_OTP: `${BASEURL}${PREFIX}/verify-otp`,
  RESET_PASSWORD: `${BASEURL}${PREFIX}/reset-password`,
  RESEND_OTP: `${BASEURL}${PREFIX}/resend-otp`,
  ADMIN_PROFILE: `${BASEURL}/admin/admin-profile`,
};

export const USERS = {
  LIST: `${BASEURL}/admin/get-all-customers`,
  ADMIN_PROFILE: `${BASEURL}${PREFIX}/admin-profile`,
  UPDATE_PROFILE: `${BASEURL}/admin/update-profile`,
  DETAILS: `${BASEURL}${PREFIX}/get-user-details`,
  CREATE: `${BASEURL}${PREFIX}/create-user`,
  EDIT: `${BASEURL}${PREFIX}/edit-user`,
  SUSPEND: `${BASEURL}${PREFIX}/verify-suspend-user`,
  ACTIVE_INACTIVE: `${BASEURL}/admin/user-active-inactive`,
  DELETE: `${BASEURL}${PREFIX}/delete-user`,

  //ADS
  ADS: `${BASEURL}/admin/post/get-by-customer`,
  ADS_DETAIL: `${BASEURL}/admin/post/get-post-by-id`,
  CUSTOMER_REVIEW: `${BASEURL}/admin/customer/review/get-all`,
};

export const CATEGORY = {
  LIST: `${BASEURL}/admin/category/get-all`,
  CREATE: `${BASEURL}/admin/category/create`,
  UPDATE: `${BASEURL}/admin/category/update`,
  DELETE: `${BASEURL}/admin/category/delete`,
};

export const SUPPORT = {
  LIST: `${BASEURL}/admin/contact-issue/get-all`,
  DELETE: `${BASEURL}/admin/category/delete`,
};

export const DASHBOARD = {
  YEARLY_CUSTOMER: `${BASEURL}/admin/customer/get-monthly-new-users`,
  DASHBOARD_COUNT: `${BASEURL}/admin/count/dashboard-stats`,
  CATPOSTCOUNT: `${BASEURL}/admin/post/get-count-by-category`,
};

export const SUBCATEGORY = {
  LIST: `${BASEURL}/admin/category/subcategory/get-all`,
  CREATE: `${BASEURL}/admin/category/subcategory/create`,
  UPDATE: `${BASEURL}/admin/category/subcategory/update`,
  DELETE: `${BASEURL}/admin/category/subcategory/delete`,
};

export const FORMSTRUCTURE = {
  SUBBYCATID: `${BASEURL}/admin/category/subcategory/get-by-category`,
  CREATE: `${BASEURL}/admin/forms/create`,
  LIST: `${BASEURL}/admin/forms/get-all`,
  EDIT: `${BASEURL}/admin/forms`,
  UPDATE: `${BASEURL}/admin/forms/update`,
};

export const CONTENTMANAGEMENT = {
  CREATE: `${BASEURL}/content/create`,
  LIST: `${BASEURL}/content/get-all-posts`,
  EDIT: `${BASEURL}/content`,
  UPDATE: `${BASEURL}/content/update`,
};

export const POSTS = {
  LIST: `${BASEURL}/admin/post/get-all`,
  CHANGE_STATUS: `${BASEURL}/admin/post/change-status`,
  DELETE: `${BASEURL}/admin/post/delete`,
};

export const REPORT = {
  LIST: `${BASEURL}/admin/report/get-all`,
  DELETE: `${BASEURL}/admin/report/delete`,
};

export const BANNER = {
  LIST: `${BASEURL}/admin/banner/get-all`,
  CREATE: `${BASEURL}/admin/banner/create`,
  EDIT: `${BASEURL}/admin/banner/get-by-id`,
  UPDATE: `${BASEURL}/admin/banner/update`,
  DELETE: `${BASEURL}/admin/banner/delete`,
};

export const DRIVERS = {
  LIST: `${BASEURL}/users/all`,
  DETAILS: `${BASEURL}${PREFIX}/get-user-details`,
  CREATE: `${BASEURL}${PREFIX}/create-driver`,
  EDIT: `${BASEURL}${PREFIX}/edit-user`,
  SUSPEND: `${BASEURL}${PREFIX}/verify-suspend-user`,
  DELETE: `${BASEURL}${PREFIX}/delete-user`,
};
export const VEHICLES = {
  LIST: `${BASEURL}/users/all`,
  DETAILS: `${BASEURL}${PREFIX}/get-user-details`,
  CREATE: `${BASEURL}${PREFIX}/create-driver`,
  EDIT: `${BASEURL}${PREFIX}/edit-user`,
  SUSPEND: `${BASEURL}${PREFIX}/verify-suspend-user`,
  DELETE: `${BASEURL}${PREFIX}/delete-user`,
};

export const SUBJECT = {
  LIST: `${BASEURL}/subject/get-all-subjects`,
  DETAILS: `${BASEURL}/subject/get-subject-details`,
  CREATE: `${BASEURL}/subject/add-subject`,
  EDIT: `${BASEURL}/subject/edit-subject`,
  DELETE: `${BASEURL}/subject/delete-subject`,
};

export const LESSON = {
  LIST: `${BASEURL}/lessons/get-all-lessons`,
  DETAILS: `${BASEURL}/lessons/get-lesson-details`,
  CREATE: `${BASEURL}/lessons/add-lesson`,
  EDIT: `${BASEURL}/lessons/edit-lesson`,
  DELETE: `${BASEURL}/lessons/delete-lesson`,
};
