import { RouterProvider } from "react-router";
import { ConfigProvider } from "antd";

import router from '@/router/router.jsx';
import { useEffect } from "react";
const app = () => {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};
export default app;