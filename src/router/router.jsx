import {createHashRouter} from "react-router";

import ErrorPage from "@/pages/error.jsx";

import IndexPage from "@/pages/index/index.jsx";
import UserLoginPage from "@/pages/user/login.jsx";
import LearningIndexPage from "@/pages/index/learning/learning.jsx";
import ClassDetailPage from "@/pages/class/class_detail.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user/login",
    element: <UserLoginPage />,
  },
  {
    path: "/classes",
    element: <LearningIndexPage />
  },
  {
    path: "/class-detail/:classId/:courseId",
    element: <ClassDetailPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "courseware",
        element: <div>coursewarepage</div>
      },
      {
        path: "info",
        element: <div>infopage</div>
      },
      {
        path: "activity",
        element: <div>activitypage</div>
      },
      {
        path: "statistic",
        element: <div>statisticpage</div>
      }
    ]
  }
]);

export default router;