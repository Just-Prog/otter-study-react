import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Row,
} from "antd";

const { Header, Content, Footer, Sider } = Layout;

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { EditOutlined, HomeOutlined, MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import default_avatar from "@/assets/avatar/default.svg";
import logo from "@/assets/logo.png";
import AntdMenuHyperLink from "@/components/common/antd_menu_hyperlink";
import MessageNotifyIcon from "@/components/index/message.jsx";
import IndexNewsList from "@/components/index/news_list.jsx";
import {
  CourseActivity,
  CoursewareList,
  RecentContent,
} from "@/components/index/stu_activities.jsx";
import TenantCarousel from "@/components/index/tenant_carousel.jsx";
import TenantSwitcher from "@/components/index/tenant_switcher.jsx";
import IndexThreeNews from "@/components/index/three_news.jsx";
import { UserLoginCard } from "@/pages/user/login.jsx";
import { logout } from "@/stores/user.jsx";

function NavBarRight({ inDrawer = false }) {
  const isLogined = useSelector((state) => state.user.isLogined);
  const info = useSelector((state) => state.user.info);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleClick = (e) => {
    console.log(e);
  };
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
          <div
            style={{
              margin: "15px auto",
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                size={64}
                src={
                  <img
                    referrerPolicy={"no-referrer"}
                    src={info.av ?? default_avatar}
                  />
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                {info.nm}
              </span>
              <span style={{ fontSize: "12px" }}>
                {info.tenants &&
                  JSON.stringify(info.tenants) !== "{}" &&
                  (info.tenants[0]?.tenantName ?? "未选择租户")}
              </span>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "#logout",
      label: (
        <AntdMenuHyperLink onClick={() => logoutAction()}>
          登出
        </AntdMenuHyperLink>
      ),
    },
  ];
  const dropdownMenuProps = {
    items: dropdownItems,
  };
  if (isLogined)
    if (inDrawer)
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Menu items={dropdownItems} style={{ width: "100%" }} />
        </div>
      );
    else
      return (
        <>
          <MessageNotifyIcon style={{ marginRight: "20px" }} />
          <Dropdown
            arrow={true}
            menu={dropdownMenuProps}
            onClick={handleClick}
            placement="bottom"
            trigger={["click", "hover"]}
          >
            <Avatar
              src={
                <img
                  referrerPolicy={"no-referrer"}
                  src={info.av ?? default_avatar}
                />
              }
            />
          </Dropdown>
        </>
      );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Button color="default" onClick={() => onButtonClicked()} type="primary">
        登录/注册
      </Button>
    </div>
  );
}

function IndexFrame({ children, showSider = false }) {
  const isLogined = useSelector((state) => state.user.isLogined);
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
  };
  const closeDrawer = () => {
    setOpen(false);
  };
  const sideBarStu = [
    {
      key: "/",
      label: "首页",
      icon: <HomeOutlined />,
    },
    {
      key: "/classes",
      label: "学习",
      icon: <EditOutlined />,
    },
  ];
  const onclick = (item) => {
    nav(item.key);
  };
  useEffect(() => {
    setSiderDefault([location.pathname]);
  }, []);
  return (
    <Layout>
      {isLogined && tenant && showSider && (
        <Sider
          breakpoint={"lg"}
          collapsedWidth="0"
          id="layoutSider"
          style={{
            background: "#fff",
            height: "100vh",
            position: "sticky",
            top: "0",
            display: "flex",
            flexDirection: "column",
          }}
          trigger={null}
          width="240px"
        >
          <TenantSwitcher />
          <Menu
            items={sideBarStu}
            multiple={false}
            onClick={onclick}
            selectedKeys={siderDefault}
            style={{
              width: "100%",
              marginTop: "15px",
              borderInlineEnd: "none",
              flex: 1,
            }}
          />
          <div>OtterStudy 2025</div>
        </Sider>
      )}
      <Layout id="layoutMain">
        <Header id="layoutHeader">
          <div id="layoutDrawerTrigger">
            <Button icon={<MenuOutlined />} onClick={() => openDrawer()} />
          </div>
          <div id="layoutHeaderMain">
            <div className="logo">
              <img
                height="52"
                onClick={() => {
                  nav("/");
                }}
                src={logo}
              />
            </div>
            <div id="layoutAvatar">
              <NavBarRight />
            </div>
          </div>
        </Header>
        <Content id="layoutContent">
          <div id="layoutContentMiddle">{children}</div>
        </Content>
        <Footer id="layoutFooter">
          <div id="layoutFooterMain">
            <span>OtterStudy {new Date().getFullYear()}</span>
          </div>
        </Footer>
      </Layout>
      <Drawer
        closable={false}
        onClose={closeDrawer}
        open={open}
        placement="left"
        width={315}
      >
        <NavBarRight inDrawer={true} />
        <Menu
          items={sideBarStu}
          multiple={false}
          onClick={onclick}
          selectedKeys={siderDefault}
          style={{
            width: "100%",
            marginTop: "15px",
            borderInlineEnd: "none",
            flex: 1,
          }}
        />
      </Drawer>
    </Layout>
  );
}

function IndexPage() {
  const isLogined = useSelector((state) => state.user.isLogined);
  const tenant = useSelector((state) => {
    try {
      return state.user.info.tenants[0].tenantId;
    } catch (e) {
      return null;
    }
  });
  useEffect(() => {
    document.title = "OtterStudy";
  }, []);
  if (isLogined)
    return (
      <>
        <IndexFrame showSider={true}>
          <Row gutter={[{ xs: 4, lg: 24 }, 20]}>
            <Col lg={12} xs={24}>
              <div className="vertical_col">
                <TenantCarousel />
                <IndexThreeNews />
                {tenant && <CourseActivity />}
              </div>
            </Col>
            <Col lg={12} xs={24}>
              <div className="vertical_col">
                {tenant ? (
                  <>
                    <RecentContent />
                    <CoursewareList />
                  </>
                ) : (
                  <Card title={"选择租户"}>
                    <TenantSwitcher isMenu={true} />
                  </Card>
                )}
              </div>
            </Col>
          </Row>
        </IndexFrame>
      </>
    );
  return (
    <>
      <IndexFrame>
        <Row gutter={{ xs: 4, lg: 24 }}>
          <Col lg={12} xs={24}>
            <div className="vertical_col">
              <TenantCarousel />
              <IndexNewsList />
            </div>
          </Col>
          <Col lg={12} xs={0}>
            <div className="vertical_col">
              <UserLoginCard
                style={{
                  background:
                    "linear-gradient(180deg, rgba(55, 120, 252, 0.15), white 60%)",
                  width: "100%",
                  position: "sticky",
                  top: "79px",
                }}
              />{" "}
              {/* 79px=header(64px)+margin-top(15px) */}
            </div>
          </Col>
        </Row>
      </IndexFrame>
    </>
  );
}

export { IndexFrame };

export default IndexPage;
