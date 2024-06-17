import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { Button, Offcanvas } from "react-bootstrap";
import { FaBarsStaggered } from "react-icons/fa6";
import { isTokenExpired } from "../functions/isTokenExpired";
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (isExpired) {
        navigate("/login");
      }
    }
    if (!token) {
      navigate("/login");
      return;
    }
  });
  return (
    <div className="d-flex">
      <Button className="d-lg-none" onClick={toggleSidebar}>
        <FaBarsStaggered />
      </Button>
      <div className="d-none d-lg-block position-fixed">
        <SidebarMenu />
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-start align-content-center flex-wrap bg-light">
        <Outlet />
      </div>
      <Offcanvas
        show={sidebarOpen}
        onHide={toggleSidebar}
        responsive="lg"
        className="d-lg-none bg-light"
        style={{ width: "260px" }}
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body className="p-0">
          <SidebarMenu isOpen={sidebarOpen} onClose={toggleSidebar} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Layout;
