import {Avatar, Layout, Menu, Dropdown, Button, Row, Col, Carousel, Drawer, Card, Space, Badge} from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.css";
import AntdMenuHyperLink from "@/components/common/antd_menu_hyperlink";

import default_avatar from "@/assets/avatar/default.svg";
import logo from "@/assets/logo.png";
import {UserLoginCard} from "@/pages/user/login.jsx";
import { logout } from '@/stores/user.jsx';
import {EditOutlined, HomeOutlined, MenuOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";

import TenantCarousel from "@/components/index/tenant_carousel.jsx";
import IndexNewsList from "@/components/index/news_list.jsx";
import IndexThreeNews from "@/components/index/three_news.jsx";
import TenantSwitcher from "@/components/index/tenant_switcher.jsx";
import MessageNotifyIcon from "@/components/index/message.jsx";
import {CourseActivity, CoursewareList, RecentContent} from "@/components/index/stu_activities.jsx";
import {useLocation} from "react-router";

function NavBarRight({ inDrawer = false }) {
  const isLogined = useSelector(state => state.user.isLogined);
  const info = useSelector(state => state.user.info);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleClick = (e) => {
    console.log(e)
  }
  const logoutAction = () => {
    dispatch(logout());
    nav("/");
  };
  const onButtonClicked = () => {
    nav("/user/login");
  };
  const dropdownItems = [
    {
      key: "#info",
      label: (
          <>
            <div style={{margin: "15px auto", display: "flex", justifyContent: "flex-start", flexDirection: "row"}}>
              <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                <Avatar src={<img src={info.av ?? default_avatar} referrerPolicy={"no-referrer"}/>} size={64}></Avatar>
              </div>
              <div style={{display: "flex", flexDirection: "column", flex: "1", justifyContent: "center"}}>
                <span style={{fontSize: "18px", fontWeight: "bold"}}>{info.nm}</span>
                <span style={{fontSize: "12px"}}>{info.tenants && JSON.stringify(info.tenants) !== "{}" && (info.tenants[0]?.tenantName ?? "未选择租户")}</span>
              </div>
            </div>
          </>
      ),
    },
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
          <Menu items={dropdownItems} style={{width: '100%'}}/>
        </div>
      );
    else return (
      <>
        <MessageNotifyIcon style={{ marginRight: "20px" }}/>
        <Dropdown
            trigger={["click", "hover"]}
            placement="bottom"
            arrow={true}
            menu={dropdownMenuProps}
            onClick={handleClick}
        >
          <Avatar src={<img src={info.av ?? default_avatar} referrerPolicy={"no-referrer"}/>}></Avatar>
        </Dropdown>
      </>
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

function IndexFrame({children, showSider = false}) {
  const isLogined = useSelector(state => state.user.isLogined);
  const location = useLocation();
  const nav = useNavigate();
  const tenant = useSelector((state) => {
    try {
      return state.user.info.tenants[0].tenantId;
    } catch (e) {
      return null;
    }
  });
  const [open, setOpen] = useState(false);
  const [siderDefault, setSiderDefault] = useState([]);
  const openDrawer = () => {
    setOpen(true);
  }
  const closeDrawer = () => {
    setOpen(false);
  }
  const sideBarStu = [
    {
      key: "/",
      label: "首页",
      icon: <HomeOutlined />,
    },
    {
      key: "/classes",
      label: "学习",
      icon: <EditOutlined />
    }
  ]
  const onclick = (item) => {
    nav(item.key);
  }
  useEffect(() => {
    setSiderDefault([location.pathname])
  }, []);
  return (
      <Layout>
        { isLogined && tenant && showSider &&
          <Sider id="layoutSider" breakpoint={'lg'} style={{background: "#fff", height: "100vh", position: "sticky", top: "0", display: "flex", flexDirection: "column"}} width="240px" collapsedWidth="0" trigger={null}>
            <TenantSwitcher />
            <Menu items={sideBarStu} multiple={false} selectedKeys={siderDefault} onClick={onclick} style={{width: "100%", marginTop: "15px", borderInlineEnd: "none", flex: 1}}/>
            <div>
              OtterStudy 2025
            </div>
          </Sider> }
        <Layout id="layoutMain">
          <Header id="layoutHeader">
            <div id="layoutDrawerTrigger">
              <Button icon={<MenuOutlined />} onClick={()=>openDrawer()}/>
            </div>
            <div id="layoutHeaderMain">
              <div className="logo">
                <img src={logo} height="52" onClick={()=>{nav("/")}}/>
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
          <Menu items={sideBarStu} multiple={false} selectedKeys={siderDefault} onClick={onclick} style={{width: "100%", marginTop: "15px", borderInlineEnd: "none", flex: 1}}/>
        </Drawer>
      </Layout>
  );
}

function IndexPage() {
  const isLogined = useSelector(state => state.user.isLogined);
  const tenant = useSelector((state) => {
    try{
      return state.user.info.tenants[0].tenantId;
    }catch(e){
      return null;
    }
  });
  useEffect(() => {
    document.title = "OtterStudy";
  }, []);
  if (!isLogined)
    return (
        <>
          <IndexFrame>
            <Row gutter={{ xs: 4, lg: 24}}>
              <Col xs={24} lg={12}>
                <div className="vertical_col">
                  <TenantCarousel/>
                  <IndexNewsList/>
                </div>
              </Col>
              <Col xs={0} lg={12}>
                <div className="vertical_col">
                  <UserLoginCard style={{background: "linear-gradient(180deg, rgba(55, 120, 252, 0.15), white 60%)", width: "100%", position: "sticky", top: "79px"}}/> {/* 79px=header(64px)+margin-top(15px) */}
                </div>
              </Col>
            </Row>
          </IndexFrame>
        </>
    );
  else return (
      <>
        <IndexFrame showSider={true}>
          <Row gutter={[{xs:4, lg:24},20]}>
            <Col xs={24} lg={12}>
              <div className="vertical_col">
                <TenantCarousel/>
                <IndexThreeNews/>
                {tenant && <CourseActivity/>}
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="vertical_col">
                {tenant ?
                    <>
                      <RecentContent/>
                      <CoursewareList/>
                    </>
                    :
                    <Card title={"选择租户"}>
                      <TenantSwitcher isMenu={true} />
                    </Card>
                }
              </div>
            </Col>
          </Row>
        </IndexFrame>
      </>
  );
}

export { IndexFrame };

export default IndexPage;
