import { RouterProvider } from "react-router";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { useEffect } from "react";
import router from '@/router/router.jsx';

import userStore, { checkLoginStatus } from '@/stores/user'

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
              }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </Provider>
    );
};
export default app;