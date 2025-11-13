import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import router from "@/router/router.jsx";

import userStore, { checkLoginStatus } from "@/stores/user";

import "subsetted-fonts/MiSans-VF/MiSans-VF.css";
import FAVICON from "@/assets/favicon.svg";

const app = () => {
  useEffect(() => {
    userStore.dispatch(checkLoginStatus());
    document.title = "OtterStudy";
    const $favicon = document.querySelector('link[rel="icon"]');
    $favicon.href = FAVICON;
  }, []);

  return (
    <Provider store={userStore}>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              bodyPadding: 16,
              headerPadding: 16,
            },
          },
          token: {
            fontFamily:
              "'MiSans-VF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
};
export default app;
