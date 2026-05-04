import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "../common/ScrollToTop";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/users/Users";
import { ROUTES } from "../app/constants";
import Login from "../pages/auth/login/Login";
import UnprotectedRoute from "./UnprotectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import ForgetPassword from "../pages/auth/forgetPassword/ForgetPassword";
import RootRedirect from "./RootRedirect";
import Setting from "../pages/profileSetting/Setting";
import Content from "../pages/content/Content";
import Subjects from "../pages/content/Subjects/Subjects";
import Lessons from "../pages/content/Lessons/Lessons";
import Topics from "../pages/content/Topics/Topics";
import ResetPassword from "../pages/auth/resetPassword/ResetPassword";
import CreateTopic from "../pages/content/Topics/section/CreateTopic";
import EditTopic from "../pages/content/Topics/section/EditTopic";
import EvaluationReports from "../pages/evaluationReports/EvaluationReports";
import TeachersFeedback from "../pages/teachersFeedback/TeachersFeedback";
import ParentFeedback from "../pages/parentFeedback/ParentFeedback";
import USERCARDS from "../pages/users/Users";
import Drivers from "../pages/users/section/driver";
import Customers from "../pages/users/section/customer";
import EditUserComponent from "../pages/users/section/customer/EditUserComponent";
import CreateDriver from "../pages/users/section/driver/CreateDriverModal";
import VehicleManagement from "../pages/vehicleManagement";
import EditDriverModal from "../pages/users/section/driver/EditDriverModal";
import EditDriverComponent from "../pages/users/section/driver/EditDriverComponent";
import MainCategory from "../pages/category/MainCategory";
import SelectCategory from "../pages/category/SelectCategory";
import SubCategory from "../pages/category/sub_category/SubCategory";
import Structure from "../pages/formStructure/Structure";
import CreateStructure from "../pages/formStructure/CreateStructure";
import UpdateStructure from "../pages/formStructure/UpdateStructure";
import ContentManagement from "../pages/contentManagement/ContentManagement";
import CreateContentManagement from "../pages/contentManagement/CreateContentManagement";
import UpdateContentManagement from "../pages/contentManagement/UpdateContentManagement";
import Activity from "../pages/users/section/customer/Activity";
import ProductDetailPage from "../pages/users/section/ProductDetailPage";
import UserAdsPage from "../pages/users/section/customer/ads/UserAdsPage";
import Products from "../pages/products";
import Post from "../pages/posts/post";
import Reports from "../pages/report";

import ReportedPost from "../pages/report/ReportedPost";
import ReportedSeller from "../pages/report/ReportedSeller";
import Banner from "../pages/banner";
import Review from "../pages/users/section/customer/Review";
import Support from "../pages/support";

function Routers() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path={ROUTES.login}
          element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          }
        />
        <Route
          path={ROUTES.forgetPassword}
          element={
            <UnprotectedRoute>
              <ForgetPassword />
            </UnprotectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path={ROUTES?.dashboard} element={<Dashboard />} />
          {/* User Driver Card  */}
          <Route path={ROUTES?.USERS?.root} element={<USERCARDS />} />
          {/* Driver Routes  */}
          <Route path={ROUTES?.USERS.drivers} element={<Drivers />} />
          <Route
            path={ROUTES?.USERS.Create_New_Driver}
            element={<CreateDriver />}
          />
          <Route
            path={`${ROUTES?.USERS.customers}/:id`}
            element={<EditUserComponent />}
          />
          <Route
            path={`${ROUTES?.USERS.drivers}/:id`}
            element={<EditDriverComponent />}
          />
          {/* Customer Routes  */}
          <Route path={ROUTES?.USERS.customers} element={<Customers />} />
          {/* Vehicle Management  */}
          <Route
            path={ROUTES?.VEHICLE_MANAGEMENT.root}
            element={<VehicleManagement />}
          />
          <Route
            path={ROUTES?.VEHICLE_MANAGEMENT.root}
            element={<VehicleManagement />}
          />
          ``
          {/*  */}
          <Route path={ROUTES?.CONTENT?.root} element={<Content />} />
          <Route path={ROUTES?.CONTENT?.subjects} element={<Subjects />} />
          <Route path={ROUTES?.CONTENT?.lessons} element={<Lessons />} />
          <Route path={ROUTES?.CONTENT?.topics.root} element={<Topics />} />
          <Route
            path={ROUTES?.CONTENT?.topics.create}
            element={<CreateTopic />}
          />
          <Route
            path={`${ROUTES?.CONTENT?.topics.root}/:id`}
            element={<EditTopic />}
          />
          <Route
            path={`${ROUTES?.EVALUATION_REPORTS.root}`}
            element={<EvaluationReports />}
          />
          <Route
            path={`${ROUTES?.FEEDBACK.root}`}
            element={<TeachersFeedback />}
          />
          <Route
            path={`${ROUTES?.CATEGORY.OPTION.root}`}
            element={<SelectCategory />}
          />
          <Route
            path={`${ROUTES?.CATEGORY.MAIN.root}`}
            element={<MainCategory />}
          />
          <Route
            path={`${ROUTES?.CATEGORY.CHILD.root}`}
            element={<SubCategory />}
          />
          <Route
            path={`${ROUTES?.FORM_STRUCTURE.root}`}
            element={<Structure />}
          />
          <Route
            path={`${ROUTES?.FORM_STRUCTURE.create}`}
            element={<CreateStructure />}
          />
          <Route
            path={`${ROUTES?.FEEDBACK_TO_PARENT.root}`}
            element={<ParentFeedback />}
          />
          <Route
            path={`${ROUTES?.FORM_STRUCTURE.update}/:id`}
            element={<UpdateStructure />}
          />
          <Route path={ROUTES?.setting} element={<Setting />} />
          <Route
            path={`${ROUTES?.CONTEMT_MANAGEMENT.root}`}
            element={<ContentManagement />}
          />
          <Route
            path={`${ROUTES?.CONTEMT_MANAGEMENT.create}`}
            element={<CreateContentManagement />}
          />
          <Route
            path={`${ROUTES?.CONTEMT_MANAGEMENT.update}/:id`}
            element={<UpdateContentManagement />}
          />
          <Route
            path={`${ROUTES?.USERS.activity}/:id`}
            element={<Activity />}
          />
          <Route path={`${ROUTES?.USERS.ads}/:id`} element={<UserAdsPage />} />
          <Route
            path={`${ROUTES?.USERS.detail}/:id`}
            element={<ProductDetailPage />}
          />
          <Route path={`${ROUTES?.PRODUCT.root}`} element={<Products />} />
          <Route path={`${ROUTES?.POST.root}`} element={<Post />} />
          <Route path={`${ROUTES?.REPORT.root}`} element={<Reports />} />
          <Route path={`${ROUTES?.REPORT.post}`} element={<ReportedPost />} />
          <Route
            path={`${ROUTES?.REPORT.seller}`}
            element={<ReportedSeller />}
          />
          <Route
            path={`${ROUTES?.BANNER.root}`}
            element={<Banner />}
          />

           <Route
            path={`${ROUTES?.REVIEW.root}:id`}
            element={<Review />}
          />

          <Route
            path={`${ROUTES?.SUPPORT.root}`}
            element={<Support />}
          />

        </Route>
      </Routes>
    </>
  );
}

export default Routers;
