import {Avatar, Layout, Menu, Dropdown, Button, Row, Col, Carousel, Drawer} from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import "./index.css";
import AntdMenuHyperLink from "@/components/common/antd_menu_hyperlink";

import default_avatar from "@/assets/avatar/default.svg";
import logo from "@/assets/logo.png";
import {UserLoginCard} from "@/pages/user/login.jsx";
import { logout } from '@/stores/user.jsx';
import {MenuOutlined} from "@ant-design/icons";
import {useState} from "react";

function NavBarRight({ inDrawer = false }) {
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
    if(inDrawer)
      return (
        <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <Avatar src={default_avatar} size={64}></Avatar>
          <div style={{height: '30px'}}/>
          <Menu items={dropdownItems} style={{width: '100%'}}/>
        </div>
      );
    else return (
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
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}}>
        <Button color="default" type="primary" onClick={() => onButtonClicked()}>
          登录/注册
        </Button>
      </div>
    );
}

function IndexFrame({children}) {
  const isLogined = useSelector(state => state.user.isLogined);
  const [open, setOpen] = useState(false);
  const openDrawer = () => {
    setOpen(true);
  }
  const closeDrawer = () => {
    setOpen(false);
  }
  return (
      <Layout>
        { isLogined && <Sider id="layoutSider" breakpoint={'lg'} style={{background: "#fff"}} width="240px"></Sider> }
        <Layout id="layoutMain">
          <Header id="layoutHeader">
            <div id="layoutDrawerTrigger">
              <Button icon={<MenuOutlined />} onClick={()=>openDrawer()}/>
            </div>
            <div id="layoutHeaderMain">
              <div className="logo">
                <img src={logo} height="52" />
              </div>
              <div id="layoutAvatar">
                <NavBarRight />
              </div>
            </div>
          </Header>
          <Content id="layoutContent">
            <div id="layoutContentMiddle">
              {children}
            </div>
          </Content>
          <Footer id="layoutFooter">
            <div id="layoutFooterMain">
              <span>OtterStudy {new Date().getFullYear()}</span>
            </div>
          </Footer>
        </Layout>
        <Drawer
            placement="left"
            closable={false}
            onClose={closeDrawer}
            open={open}
            width={315}
        >
          <NavBarRight inDrawer={true}/>
        </Drawer>
      </Layout>
  );
}

function IndexPage() {
  const isLogined = useSelector(state => state.user.isLogined);
  if (!isLogined)
    return (
        <>
          <IndexFrame>
            <Row>
              <Col xs={24} lg={12}>
              </Col>
              <Col xs={0} lg={12}>
                <UserLoginCard style={{background: "linear-gradient(180deg, rgba(55, 120, 252, 0.15), white 60%)", width: "100%", position: "sticky", top: "79px"}}/> {/* 79px=header(64px)+margin-top(15px) */}
              </Col>
            </Row>
          </IndexFrame>
        </>
    );
  else return (
      <>
        <IndexFrame>
          constructing
        </IndexFrame>
      </>
  );
}

export default IndexPage;
