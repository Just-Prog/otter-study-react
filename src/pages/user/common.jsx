import DoubleColumn from "@/layouts/double_column.jsx";
import {Col, Layout, Row} from "antd";

const {Header, Content, Footer} = Layout;
import "./common.css";

import logo from "@/assets/logo.png";
import {useEffect} from "react";

const UserPageCommon = ({children}) => {
    useEffect(() => {
        document.title = "用户中心 - OtterStudy";
    }, []);
    return (
        <>
            <DoubleColumn
                child={
                    <div style={{height: "100%", width: "100%"}}>
                        <Layout className="user_right">
                            <Header
                                className="user_right_header"
                                style={{
                                    width: "100%",
                                    height: "72px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                }}
                            >
                                <img src={logo} height={56}/>
                                <span>
                  <b style={{fontSize: '22px'}}>用户系统</b>
                </span>
                            </Header>
                            <Content
                                style={{
                                    overflow: "auto",
                                }}
                            >
                                <Row justify="center" align="middle" style={{height: "calc(100vh - 144px)"}}>
                                    <Col xs={22} md={20} lg={18}>
                                        {children}
                                    </Col>
                                </Row>
                            </Content>
                            <Footer
                                className="user_right_footer"
                                style={{
                                    height: "72px",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <span>OtterStudy UserCenter</span>
                            </Footer>
                        </Layout>
                    </div>
                }
            />
        </>
    );
};

export default UserPageCommon;
