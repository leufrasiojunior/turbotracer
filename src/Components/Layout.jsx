import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { Button, Offcanvas } from "react-bootstrap";
import { FaBarsStaggered } from "react-icons/fa6";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      <Button className="d-lg-none" onClick={toggleSidebar}>
        <FaBarsStaggered />
      </Button>
      <div className="d-none d-lg-block">
        <SidebarMenu />
      </div>
      <div className="flex-grow-1">
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
