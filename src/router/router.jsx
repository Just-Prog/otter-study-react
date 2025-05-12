import {createHashRouter} from "react-router";

import ErrorPage from "@/pages/error.jsx";

import IndexPage from "@/pages/index/index.jsx";
import UserLoginPage from "@/pages/user/login.jsx";
import LearningIndexPage from "@/pages/index/learning/learning.jsx";
import ClassDetailPage, {
  ClassCourseWareActivityPage,
  ClassInfoPage,
  ClassStatisticPage,
  ClassActivityPage,
} from "@/pages/class/class_detail.jsx";
import ClassCoursewareResPage from "@/components/class/courseware.jsx";

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
        element: <ClassCourseWareActivityPage/>,
        children: [
          {
            path: ":chapterId/:docId",
            element: <ClassCoursewareResPage/>
          }
        ]
      },
      {
        path: "info",
        element: <ClassInfoPage/>
      },
      {
        path: "activity",
        element: <ClassCourseWareActivityPage/>,
        children: [
          {
            path: ":type/:actId",
            element: <ClassActivityPage/>
          }
        ]
      },
      {
        path: "statistic",
        element: <ClassStatisticPage/>
      }
    ]
  }
]);

export default router;