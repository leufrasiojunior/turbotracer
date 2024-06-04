/* eslint-disable react/prop-types */
// src/Components/SidebarMenu.js
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import {
  FaHouse,
  FaDatabase,
  FaRegUser,
  FaGear,
  FaBookOpen,
  FaGithub,
} from "react-icons/fa6";

const SidebarMenu = ({ isOpen, onClose }) => {
  return (
    <div
      className={`bg-light vh-100 p-4 d-flex flex-column ${
        isOpen ? "" : "border"
      }`}
      style={{ width: "250px" }}
    >
      <div className="mb-4">
        <h2>TurboTracer</h2>
      </div>
      <Nav className="flex-column d-flex gap-3">
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard" onClick={onClose}>
            <FaHouse className="mx-2" />
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/results" onClick={onClose}>
            <FaDatabase className="mx-2" />
            Results
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/users" onClick={onClose}>
            <FaRegUser className="mx-2" />
            Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/settings" onClick={onClose}>
            <FaGear className="mx-2" />
            Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mt-auto gap-2 d-flex flex-column" id="down">
        <div>
          <h5>Links</h5>
        </div>
        <Nav className="flex-column gap-3">
          <Nav.Item>
            <Nav.Link as={Link} to="/documentation" onClick={onClose}>
              <FaBookOpen className="mx-2" />
              Documentation
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/github" onClick={onClose}>
              <FaGithub className="mx-2" />
              GitHub
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default SidebarMenu;
