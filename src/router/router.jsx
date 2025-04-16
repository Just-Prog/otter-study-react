import {createHashRouter} from "react-router";
import IndexPage from "@/pages/index.jsx";

const router = createHashRouter([
    {
        path: '/',
        element: <IndexPage />,
    }
]);

export default router;