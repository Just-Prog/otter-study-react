import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Tabs } from "antd";
import CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import userStore, { setOSSConfig, setToken } from "@/stores/user";
import UserPageCommon from "./common";

import "./login.css";

const tokenFetch = async (xCode) => {
  const code = JSON.parse(xCode);
  const u_code = code.code;
  const uid = code.uid;
  const t_resp = await api.get("/uc/v1/users/token", {
    params: {
      code: u_code,
      uid,
    },
  });
  userStore.dispatch(
    setToken({
      token: t_resp.headers["x-token"],
      macKey: t_resp.headers["x-mackey"],
    })
  );
  await fetchOSSConfig();
};

const fetchOSSConfig = async () => {
  const resp = await api.get("/tc/doc/config");
  userStore.dispatch(setOSSConfig(resp.data));
};

const UserPasswordLoginForm = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const rid = useRef("");
  const forgetPwd = () => {
    messageApi.info("维护中");
  };
  const onFinish = (_) => {
    const uid = form.getFieldValue().username;
    api
      .post("/uc/v1/users/pwd-login/init", {
        username: uid,
      })
      .then((_) => {
        rid.current = _.data.rid;
        let password = form.getFieldValue().password;
        password = CryptoJS.MD5(password).toString();
        password = CryptoJS.HmacSHA256(password, rid.current);
        password = CryptoJS.enc.Base64.stringify(password)
          .replace(/\+/g, "-")
          .replace(/=/g, "")
          .replace(/\//g, "_");

        api
          .post("/uc/v2/users/pwd-login", {
            rid: rid.current,
            username: uid,
            password,
          })
          .then((_) => {
            tokenFetch(_.headers["x-code"]).then(() => {
              navigate("/");
            });
          });
      });
  };
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        style={{ width: "100%", marginTop: "20px" }}
        variant={"filled"}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "电话号码必填" }]}
        >
          <Input placeholder="电话号码" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input placeholder="密码" prefix={<LockOutlined />} type="password" />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <a
              onClick={(e) => {
                e.preventDefault;
                forgetPwd();
              }}
            >
              忘记密码
            </a>
          </div>
        </Form.Item>
        <Form.Item>
          <Button block htmlType="submit" type="primary">
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const UserSMSLoginForm = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const rid = useRef("");
  const [verifyCodeStatus, updateVerifyStatus] = useState(false);
  const [count, setCount] = useState(60);
  const countdown = useRef();
  const onVerifyCodeFetch = () => {
    rid.current = "";
    api
      .post("/uc/teaching/v1/auto-login/acquire-sms", {
        phone: form.getFieldValue().phone,
      })
      .then((_) => {
        messageApi.success(_.data.message);
        rid.current = _.data.rid;
        updateVerifyStatus(true);
        setCount(_.data.remainingMsec / 1000);
        countdown.current = setInterval(() => {
          setCount((count) => --count);
        }, 1000);
      });
  };
  useEffect(() => {
    console.log(count);
    if (count === 0) {
      clearInterval(countdown.current);
      countdown.current = null;
      setCount(60);
      updateVerifyStatus(false);
    }
  }, [count]);
  const onFinish = () => {
    api
      .post("/uc/teaching/v1/auto-login", {
        phone: form.getFieldValue().phone,
        rid: rid.current,
        smsCode: form.getFieldValue().smsCode,
      })
      .then((_) => {
        tokenFetch(_.headers["x-code"]).then(() => {
          navigate("/");
        });
      });
  };
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        style={{ width: "100%", marginTop: "15px" }}
        variant={"filled"}
      >
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "电话号码必填" }]}
        >
          <Input placeholder="电话号码" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="smsCode"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Input
            maxLength={6}
            placeholder="验证码"
            prefix={<LockOutlined />}
            suffix={
              <Button
                disabled={verifyCodeStatus}
                onClick={(e) => {
                  onVerifyCodeFetch();
                }}
                type={"primary"}
              >
                发送验证码 {!verifyCodeStatus || `(${count})`}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <span style={{ fontSize: "12px", color: "#aaa" }}>
              未注册手机号验证后自动登录。
            </span>
          </div>
        </Form.Item>
        <Form.Item>
          <Button block htmlType="submit" type="primary">
            登录/注册
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const UserLoginCard = ({ style }) => (
  <Card style={style}>
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "sms",
          label: "短信登录",
          children: <UserSMSLoginForm />,
        },
        {
          key: "pwd",
          label: "密码登录",
          children: <UserPasswordLoginForm />,
        },
      ]}
    />
  </Card>
);

const UserLoginPage = () => (
  <>
    <UserPageCommon>
      <div style={{ textAlign: "left", width: "100%" }}>
        <h1>登录</h1>
      </div>
      <UserLoginCard style={{ width: "100%" }} />
    </UserPageCommon>
  </>
);

export default UserLoginPage;

export { UserLoginCard };
