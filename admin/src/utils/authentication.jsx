import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { Layout, App as AntdApp } from "antd";

const { Content } = Layout;

const AuthenticatedLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Layout>
          <Content style={{ margin: "8px", overflowY: "auto" }}>
            <AntdApp>
              <div
                className="layout-content-section scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-lightgary-700 scrollbar-thumb-rounded-full"
                style={{
                  height: "calc(100vh - 34px - 53px)",
                  overflowY: "auto",
                }}
              >
                <Content>{children}</Content>
              </div>
            </AntdApp>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;
