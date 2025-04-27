import {createHashRouter} from "react-router";

import ErrorPage from "@/pages/error.jsx";

import IndexPage from "@/pages/index/index.jsx";
import UserLoginPage from "@/pages/user/login.jsx";
import LearningIndexPage from "@/pages/index/learning/learning.jsx";

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
  }
]);

export default router;