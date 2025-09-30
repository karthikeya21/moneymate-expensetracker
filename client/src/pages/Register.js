import { Form, Button, message, Input, Card, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { GoogleOutlined } from "@ant-design/icons";
import "../resources/authentication.css";  // same CSS as Login
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/users/register", values);
      message.success("Registration successful");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("moneymate-user")) {
      navigate("/");
    }
  }, [navigate]);

  const googleLogin = () => {
    window.location.href = "/api/users/google";
  };

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <div className="register-container">
        {/* --- Optional left side for animation/image --- */}
        <div className="register-lottie-container">
          {/* You can add a DotLottieReact animation here if desired */}
          <DotLottieReact
                      src="https://lottie.host/9bca503a-2764-4e51-94bc-ba10a47afe35/ER6YXEASOn.lottie"
                      loop
                      autoplay
                      className="lottie-animation"
                    />
        </div>

        {/* --- Right side: Registration Form --- */}
        <div className="register-form-container">
          <Card
            className="register-card"
            title={<h2 className="card-title">Create Your Account</h2>}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input size="large" placeholder="Your full name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input size="large" placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please create a password!" }]}
              >
                <Input.Password size="large" placeholder="********" />
              </Form.Item>

              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="primary" htmlType="submit" block size="large">
                  REGISTER
                </Button>
                <div className="d-flex justify-content-center">
                  <Link to="/login">Already registered? Log in</Link>
                </div>
              </Space>
            </Form>

            <div className="divider-reg">
              <span>OR</span>
            </div>

            <Button
              block
              size="large"
              icon={<GoogleOutlined />}
              onClick={googleLogin}
            >
              Continue with Google
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Register;
