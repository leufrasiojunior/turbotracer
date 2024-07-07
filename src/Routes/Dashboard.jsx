import { Container } from "react-bootstrap";
// import ListServers from "../Components/Dashboard/ListServers";
import AvarangeByLocation from "../Components/Dashboard/AvarangeByLocation";

function Dashboard() {
  return (
    <Container className="d-flex vh-100">
      {/* <ListServers /> */}
      <AvarangeByLocation />
    </Container>
  );
}

export default Dashboard;
