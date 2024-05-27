import { Button, Container, Form } from "react-bootstrap";

function App() {
  return (
    <Container
      className="d-flex"
      style={{
        height: "100vh",
      }}
    >
      <div className="col-lg-12 d-flex flex-column flex-wrap align-content-center justify-content-center align-items-center">
        <div className="col-lg-6 d-flex flex-column flex-wrap align-content-center justify-content-center align-items-center gap-3 p-5 shadow h-75">
          <Form className="d-flex flex-column gap-3 text-center w-100">
            <h1>LOGIN</h1>
            <div className="form-group">
              <label>Your username </label>
              <input type="text" id="username" className="form-control" />
            </div>

            <div className="form-group">
              <label>Your password</label>
              <input type="password" id="password" className="form-control" />
            </div>
            <div className="login-button d-flex flex-column flex-wrap align-content-center justify-content-center align-items-center">
              <Button className="btn btn-default w-75">Login</Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default App;
