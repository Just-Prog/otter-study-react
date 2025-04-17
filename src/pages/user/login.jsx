import { NavLink } from "react-router";
import UserPageCommon from "./common";

const UserLoginPage = () => {
  return (
    <>
      <UserPageCommon>
        <h1>UserLoginPage</h1>
        <NavLink to="/user/register">没有账户？前往注册</NavLink>
      </UserPageCommon>
    </>
  );
};

export default UserLoginPage;
