import { CATEGORY } from "../../config/endPoints";

export const TITLES = {
  login: "Login",
  forgetPassword: "Forgot-password",
  resetPass: "Reset-password",
  dashboard: "Dashboard",
  USERS: {
    root: "Users",
    drivers: "Drivers",
    Create_New_Driver: " Create New Driver",
    driver_Info: "Driver Info",
    customers: "Customers",
    customer_Info: "Customer Info",
    activity: "Activity",
    ads: "Ads",
  },

  VEHICLES_MANAGEMENT: {
    root: "Vehicle Management",
  },
  CONTENT: {
    root: "Content",
  },

  PRODUCT: {
    root: "Products",
  },

  CATEGORY: {
    MAIN: {
      root: "Main Category",
    },
    CHILD: {
      root: "Sub Category",
    },
    OPTION: {
      root: "Category",
    },
  },

  FORM_STRUCTURE: {
    root: "Create Ads",
  },



  POST: {
    root: "Posts",
  },

  REPORT: {
    root: "Reports",
    post_repocrt: "Post Reports",
    seller_report: "Seller Reports",

    post: "Posts",
    seller: "Seller",
  },

  BANNER: {
    root: "Banner",
  },

   SUPPORT: {
    root: "Support",
  }, 
  REVIEW: {
    root: "Review",
  },

  CONTEMT_MANAGEMENT: {
    root: "Content Management",
  },

  FEEDBACK: {
    root: "Lessons Feedback",
  },
  FEEDBACK_TO_PARENT: {
    root: "Parent Feedback",
  },
  EVALUATION_REPORTS: {
    root: "Evaluation Reports",
  },
  setting: "Account Settings",
};

export const ROUTES = {
  login: "/login",
  forgetPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  USERS: {
    root: "/users",
    drivers: "/users/drivers",
    Create_New_Driver: "/users/drivers/create",
    customers: "/users/customers",
    activity: "/users/ads",
    ads: "/users/ads/list",
    detail: "/users/ads/detail",
  },
  VEHICLE_MANAGEMENT: {
    root: "/vehicle-management",
    drivers: "/users/drivers",
    Create_New_Vehicle: "create/vehicle-management",
    customers: "/users/customers",
  },

  PRODUCT: {
    root: "/products",
  },

  CATEGORY: {
    MAIN: {
      root: "/main-category",
    },
    CHILD: {
      root: "/sub-category",
    },
    OPTION: {
      root: "/category",
    },
  },

  FORM_STRUCTURE: {
    root: "/structure",
    create: "/create-structure",
    update: "/update-structure",
  },

  CONTEMT_MANAGEMENT: {
    root: "/contentManagement",
    create: "/create-content",
    update: "/update-content",
  },

  POST: {
    root: "/posts",
  },
  SUPPORT: {
    root: "/support",
  },

  REVIEW: {
    root: "/review/",
  },

  BANNER: {
    root: "/banner",
  },

  REPORT: {
    root: "/reports",
    post: "/post/reports",
    seller: "/seller/reports/",
  },
  CONTENT: {
    root: "/content",
    subjects: "/content/subjects",
    lessons: "/content/lessons",
    topics: {
      root: "/content/topics",
      create: "/content/topics/create",
    },
  },
  FEEDBACK: {
    root: "/lessons-feedback",
  },
  FEEDBACK_TO_PARENT: {
    root: "/parent-feedback",
  },
  EVALUATION_REPORTS: {
    root: "/evaluation-reports",
  },
  setting: "/setting",
};

export const LOCAL_STORAGE = {
  USER: "user",
  ACCESS_TOKEN: "access_token",
  PROFILE_PICTURE: "profile_picture",
};
