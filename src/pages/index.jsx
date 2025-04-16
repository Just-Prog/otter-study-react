import { useState } from 'react';
import {Avatar, Layout, Menu, Dropdown, Button} from 'antd';
const { Header, Content, Footer } = Layout;
import './index.css';
import logo_img from '@/assets/logo.png'
import default_avatar from '@/assets/avatar/default.svg'

var isLoggedIn = false;
function NavBarRight(){
    const dropdownItems = [
        {
            key: "/",
            label: "登出",
        }
    ];
    const dropdownMenuProps = {
        items: dropdownItems
    }
    if( isLoggedIn )
        return <Dropdown
            trigger={["click", "hover"]}
            placement="bottom"
            arrow={true}
            menu={dropdownMenuProps }
        >
            <Avatar src={default_avatar}></Avatar>
        </Dropdown>
    else
        return (
            <Button color="default" type="primary">
                登录/注册
            </Button>
        )
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
      }
    ];

    return (
      <Layout>
        <Header id="layoutHeader">
          <div id="layoutHeaderMain">
            <div className="logo">
              <img src={logo_img} height="52" />
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
              <NavBarRight/>
            </div>
          </div>
        </Header>
        <Content id="layoutContent">
          <div id="layoutContentMiddle"></div>
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
