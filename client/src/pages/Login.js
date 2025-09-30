// src/pages/Login.js

import { Form, Button, message, Input, Card, Space } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { GoogleOutlined } from '@ant-design/icons'; // Import the icon
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Import your new stylesheet
import "../resources/authentication.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", values);
      localStorage.setItem(
        "moneymate-user",
        JSON.stringify({ token: response.data.token, user: response.data.user })
      );
      setLoading(false);
      message.success("Login successful");
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
  const hasUser = localStorage.getItem("moneymate-user");
  if (hasUser && window.location.pathname !== "/") {
    navigate("/", { replace: true });
  }
}, []);


  return (
    <div className="login-page">
      {loading && <Spinner />}
      <div className="login-container">
        <div className="login-lottie-container">
          <DotLottieReact
            src="https://lottie.host/9bca503a-2764-4e51-94bc-ba10a47afe35/ER6YXEASOn.lottie"
            loop
            autoplay
            className="lottie-animation"
          />
        </div>
        
        <div className="login-form-container">
      <Card
        className="login-card"
        title={<h1 className="card-title">MoneyMate Login</h1>}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" placeholder="youremail@example.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" placeholder="********" />
          </Form.Item>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" htmlType="submit" block size="large">
              LOGIN
            </Button>
            <div className="d-flex justify-content-center">
              <Link to="/register">Not registered? Create an account</Link>
            </div>
          </Space>
        </Form>
        <div className="divider">
            <span>OR</span>
        </div>
        <Button
          block
          size="large"
          icon={<GoogleOutlined />}
          onClick={() => window.location.href = "/api/users/google"}
        >
          Continue with Google
        </Button>
      </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;