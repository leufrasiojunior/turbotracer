import { Container } from "react-bootstrap";
import ListServers from "../Components/Dashboard/ListServers";

function Dashboard() {
  return (
    <Container className="d-flex vh-100">
      <ListServers />
    </Container>
  );
}

export default Dashboard;
