import { Form, Input, Tabs, Button, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore, {setToken} from "@/stores/user"

import CryptoJS from 'crypto-js';

import UserPageCommon from "./common";
import api from "@/api/api";

import './login.css'

const tokenFetch = async (xCode) => {
  let code = JSON.parse(xCode);
  let u_code = code.code;
  let uid = code.uid;
  api.get("/uc/v1/users/token",{params: {
    code: u_code,uid: uid
  }}).then(_=>{
    userStore.dispatch(setToken({
      token: _.headers['x-token'],
      macKey: _.headers['x-mackey']
    }));
  });
}

const UserPasswordLoginForm = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const rid = useRef("");
  const forgetPwd = () => {
    messageApi.info("维护中");
  };
  const onFinish = (_) => {
    let uid = form.getFieldValue().username;
    api.post("/uc/v1/users/pwd-login/init",{
      username: uid
    }).then((_) => {
      rid.current = _.data.rid
      let password = form.getFieldValue().password;
      password = CryptoJS.MD5(password).toString();
      password = CryptoJS.HmacSHA256(password,rid.current);
      password = CryptoJS.enc.Base64.stringify(password)
        .replace(/\+/g, "-")
        .replace(/=/g, "")
        .replace(/\//g, "_");

      api
        .post("/uc/v2/users/pwd-login", {
          rid: rid.current,
          username: uid,
          password: password,
        })
        .then((_) => {
          tokenFetch(_.headers["x-code"]).then(()=>{
            navigate("/")
          });
        });
    });
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
    if(count === 0){
      clearInterval(countdown.current)
      countdown.current = null;
      setCount(60)
      updateVerifyStatus(false);
    }
  },[count])
  const onFinish = () => {
    api
      .post("/uc/teaching/v1/auto-login", {
        phone: form.getFieldValue().phone,
        rid: rid.current,
        smsCode: form.getFieldValue().smsCode,
      })
      .then((_) => {
        tokenFetch(_.headers['x-code']).then(()=>{
          navigate("/")
        });
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

const UserLoginCard = ({style}) => {
  return (
      <Card style={style}>
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
  );
}

const UserLoginPage = () => {
  return (
    <>
      <UserPageCommon>
        <div style={{ textAlign: "left", width: "100%" }}>
          <h1>登录</h1>
        </div>
        <UserLoginCard style={{width: "100%"}}/>
      </UserPageCommon>
    </>
  );
};

export default UserLoginPage;

export { UserLoginCard }
