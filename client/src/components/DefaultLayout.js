import React from "react";
import { Dropdown, Menu, Button, Tooltip } from "antd";
import { UnorderedListOutlined, AreaChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../resources/default-layout.css";

function DefaultLayout({ children, viewType, setViewType }) {
  const user = JSON.parse(localStorage.getItem("moneymate-user"));
  const navigate = useNavigate();

  const menu = (
    <Menu
      items={[
        {
          label: (
            <li
              onClick={() => {
                localStorage.removeItem("moneymate-user");
                navigate("/login");
              }}
            >
              Logout
            </li>
          ),
        },
      ]}
    />
  );

  return (
    <div className="layout">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">  Money Mate </div>

        <div className="navbar-right">
          <Tooltip title="Data View">
            <UnorderedListOutlined
              className={viewType === "Data" ? "active-icon" : "inactive-icon"}
              onClick={() => setViewType("Data")}
            />
          </Tooltip>
          <Tooltip title="Analytics View">
            <AreaChartOutlined
              className={viewType === "Analytics" ? "active-icon" : "inactive-icon"}
              onClick={() => setViewType("Analytics")}
            />
          </Tooltip>

          {/* Greeting Text */}
          <span className="user-greeting">Hi, {user.user?.name}</span>
          
          {/* New Logout Button */}
          <Button 
            className="logout-btn" 
            onClick={() => {
              localStorage.removeItem("moneymate-user");
              navigate("/login");
            }}
          >
            Logout
          </Button>
          
          {/* ===== MODIFICATION END ===== */}
        </div>
      </div>
        

      <div className="content">{children}</div>
    </div>
  );
}

export default DefaultLayout;
