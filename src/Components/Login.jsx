import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import api from "../ApiConnect/connect";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../functions/isTokenExpired";

function LoginPage() {
  const payloadLogin = {
    email: "",
    password: "",
  };

  const [dataLogin, setDataLogin] = useState(payloadLogin);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (isExpired) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);
  const handleSetDataLogin = (e) => {
    setDataLogin({
      ...dataLogin,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", dataLogin);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setError("");
        window.location.href = "/home";
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center bg-light-custom"
    >
      <Row className="w-100 font-inter anti-aliased">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <Container className="bg-white rounded-4 shadow-sm p-5 border custom-ring">
            <h2 className="text-center">TurboTracker</h2>
            <h5 className="text-center">Sign in</h5>
            <Form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Email address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={dataLogin.email}
                  onChange={handleSetDataLogin}
                />
                {error && (
                  <Alert variant="danger" className="text-center mt-3 mb-0">
                    {error}
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={dataLogin.password}
                  onChange={handleSetDataLogin}
                />
              </Form.Group>
              <Button type="submit" className="w-100 custom-bg-button mt-3">
                Sign in
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
