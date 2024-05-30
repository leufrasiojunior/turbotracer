import { Button, Col, Container, Form, Row } from "react-bootstrap";

function App() {
  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center bg-light-custom"
    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <Container className="bg-white rounded-4 shadow-sm p-5 border custom-ring">
            <h2 className="text-center">TurboTracker</h2>
            <h5 className="text-center">Sign in</h5>
            <Form className="d-flex flex-column gap-3">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Email address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox" className="text-start">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <Button type="submit" className="w-100 custom-bg-button">
                Sign in
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
