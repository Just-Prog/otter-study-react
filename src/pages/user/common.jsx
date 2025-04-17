import DoubleColumn from "@/layouts/double_column.jsx";
import { Layout } from "antd";
const { Header, Content, Footer } = Layout;
import "./common.css";

const UserPageCommon = ({ children }) => {
  return (
    <>
      <DoubleColumn
        child={
          <div style={{ height: "100%", width: "100%" }}>
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
                <img src="/assets/logo.png" height={56} />
                <span>
                  <b style={{fontSize: '22px'}}>用户系统</b>
                </span>
              </Header>
              <Content
                style={{
                  overflow: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "calc(100vh - 144px)",
                  }}
                >
                  {children}
                </div>
              </Content>
              <Footer
                className="user_right_footer"
                style={{
                  height: "72px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Copyright
              </Footer>
            </Layout>
          </div>
        }
      />
    </>
  );
};

export default UserPageCommon;
