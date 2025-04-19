import { useState } from "react";
import {Avatar, Layout, Menu, Dropdown, Button, Row, Col, Carousel} from "antd";
const { Header, Content, Footer } = Layout;
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "./index.css";
import AntdMenuHyperLink from "@/components/common/antd_menu_hyperlink";

import default_avatar from "@/assets/avatar/default.svg";
import logo from "@/assets/logo.png";
import {UserLoginCard} from "@/pages/user/login.jsx";
import { logout } from '@/stores/user.jsx';

function NavBarRight() {
  const isLogined = useSelector(state => state.user.isLogined);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleClick = (e) => {
    console.log(e)
  }
  const logoutAction = () => {
    dispatch(logout());
  };
  const onButtonClicked = () => {
    nav("/user/login");
  };
  const dropdownItems = [
    {
      key: "#logout",
      label: (
        <AntdMenuHyperLink onClick={() => logoutAction()}>登出</AntdMenuHyperLink>
      ),
    },
  ];
  const dropdownMenuProps = {
    items: dropdownItems,
  };
  if (isLogined)
    return (
      <Dropdown
        trigger={["click", "hover"]}
        placement="bottom"
        arrow={true}
        menu={dropdownMenuProps}
        onClick={handleClick}
      >
        <Avatar src={default_avatar}></Avatar>
      </Dropdown>
    );
  else
    return (
      <Button color="default" type="primary" onClick={() => onButtonClicked()}>
        登录/注册
      </Button>
    );
}

function IndexPage() {
  const [current, setCurrent] = useState("/");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const navItems = [
    {
      key: "/",
      label: "首页",
    },
  ];

  return (
    <Layout>
      <Header id="layoutHeader">
        <div id="layoutHeaderMain">
          <div className="logo">
            <img src={logo} height="52" />
          </div>
          <div id="layoutHeaderMenu" style={{ flex: 1 }}>
            <Menu
              mode="horizontal"
              items={navItems}
              defaultSelectedKeys={[current]}
              onClick={onClick}
            />
          </div>
          <div id="layoutAvatar">
            <NavBarRight />
          </div>
        </div>
      </Header>
      <Content id="layoutContent">
        <div id="layoutContentMiddle">
          <Row>
            <Col xs={24} lg={12}>
              {/*<Carousel/>*/}111
            </Col>
            <Col xs={0} lg={12}>
              <UserLoginCard style={{background: "linear-gradient(180deg, rgba(55, 120, 252, 0.15), white 60%)", width: "100%"}}/>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer id="layoutFooter">
        <div id="layoutFooterMain">
          <span>OtterStudy {new Date().getFullYear()}</span>
        </div>
      </Footer>
    </Layout>
  );
}

export default IndexPage;
