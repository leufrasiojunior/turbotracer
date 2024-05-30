import { Button, Col, Container, Form } from "react-bootstrap";

function App() {
  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <Container className="text-center">
        <h1>TurboTracer</h1>
        <h5>Sign in</h5>
        <Form>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="text-start">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
          <Button className="mt-3">Login</Button>
        </Form>
      </Container>
    </Container>
  );
}

export default App;
