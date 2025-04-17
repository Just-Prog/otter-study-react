import { Form, Input, Tabs, Button, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";

import UserPageCommon from "./common";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

import history from "@/utils/router_history";

const tokenFetch = (xCode) => {
  let code = JSON.parse(xCode);
  let u_code = code.code;
  let uid = code.uid;
  api.get("/uc/v1/users/token",{params: {
    code: u_code,uid: uid
  }}).then(_=>{
    localStorage.setItem("token",_.headers['x-token']);
    localStorage.setItem('macKey',_.headers['x-mackey']);
    history.push('/#/');
  });
}

const UserPasswordLoginForm = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const rid = useRef("");
  const forgetPwd = () => {
    messageApi.info("维护中");
  };
  const onFinish = (_) => {
    console.log(_)
  };
  return (
    <>
      {contextHolder}
      <Form
        name="login"
        style={{ width: "100%", marginTop: "20px" }}
        onFinish={onFinish}
        variant={"filled"}
        form={form}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "电话号码必填" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="电话号码" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
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
          <Button block type="primary" htmlType="submit">
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
        messageApi.success(_.data.message)
        rid.current = _.data.rid;
        updateVerifyStatus(true);
        setCount(_.data.remainingMsec / 1000);
        countdown.current = setInterval(() => {
          setCount((count) => --count);
        }, 1000);
      });
  }
  useEffect(()=>{
    console.log(count)
    if(count == 0){
      clearInterval(countdown.current)
      countdown.current = null;
      setCount(60)
      updateVerifyStatus(false);
    }
  },[count])
  const onFinish = (_) => {
    api
      .post("/uc/teaching/v1/auto-login", {
        phone: form.getFieldValue().phone,
        rid: rid.current,
        smsCode: form.getFieldValue().smsCode,
      })
      .then((_) => {
        tokenFetch(_.headers['x-code']);
      }).catch(_=>{
        console.log(_);
      });
  };
  return (
    <>
      {contextHolder}
      <Form
        name="login"
        style={{ width: "100%", marginTop: "15px" }}
        onFinish={onFinish}
        variant={"filled"}
        form={form}
      >
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "电话号码必填" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="电话号码" />
        </Form.Item>
        <Form.Item
          name="smsCode"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="验证码"
            maxLength={6}
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
          <Button block type="primary" htmlType="submit">
            登录/注册
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const UserLoginPage = () => {
  return (
    <>
      <UserPageCommon>
        <div style={{ textAlign: "left", width: "100%" }}>
          <h1>登录</h1>
        </div>
        <Card style={{ width: "100%" }}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "sms",
                label: `短信登录`,
                children: <UserSMSLoginForm />,
              },
              {
                key: "pwd",
                label: `密码登录`,
                children: <UserPasswordLoginForm />,
              },
            ]}
          />
        </Card>
      </UserPageCommon>
    </>
  );
};

export default UserLoginPage;
