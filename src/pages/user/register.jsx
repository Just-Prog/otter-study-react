import { NavLink } from "react-router";

import UserPageCommon from "./common";

const UserRegisterPage = () => {
  return (
    <UserPageCommon>
      <h1>UserRegisterPage</h1>
      <NavLink to="/user/login">已有账户？前往登录</NavLink>
    </UserPageCommon>
  );
};

export default UserRegisterPage;
