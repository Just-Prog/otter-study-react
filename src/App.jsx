import { RouterProvider } from "react-router";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { useEffect } from "react";
import router from '@/router/router.jsx';

import userStore, { checkLoginStatus } from '@/stores/user'

import "subsetted-fonts/MiSans-VF/MiSans-VF.css";

const app = () => {
    useEffect(() => {
        userStore.dispatch(checkLoginStatus());
    }, []);

    return (
        <Provider store={userStore}>
          <ConfigProvider
              theme={{
                  components: {
                      Card: {
                          bodyPadding: 16,
                          headerPadding: 16
                      },
                  },
                  token: {
                      fontFamily: "'MiSans-VF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
                  }
              }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </Provider>
    );
};
export default app;