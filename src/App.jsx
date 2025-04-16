import { RouterProvider } from "react-router";
import { ConfigProvider } from 'antd';

import router from './router/router.jsx';

const App = () => {
    return (
        <ConfigProvider>
            <RouterProvider router={router} />
        </ConfigProvider>
    );
};
export default App;