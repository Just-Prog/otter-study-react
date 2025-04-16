import {createHashRouter} from "react-router";

import ErrorPage from "@/pages/error.jsx";

import IndexPage from "@/pages/index.jsx";
import UserPage from "@/pages/user/user.jsx";
import UserLoginPage from "@/pages/user/login.jsx";
import UserRegisterPage from "@/pages/user/register.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user",
    element: <UserPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <UserLoginPage />,
      },
      {
        path: "register",
        element: <UserRegisterPage />,
      },
    ],
  },
]);

export default router;