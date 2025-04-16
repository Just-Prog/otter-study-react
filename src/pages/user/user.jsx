import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoubleColumn from "@/layouts/double_column.jsx";

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        if(location.pathname === '/user/login' || location.pathname === '/user/register'){}else{
            navigate(-1);
        }
    },[location.pathname, navigate]);
  return (
    <>
      <DoubleColumn child={
          <div>
              <span>UserPage</span>
              <Outlet />
          </div>}
      />
    </>
  );
};

export default UserPage;
