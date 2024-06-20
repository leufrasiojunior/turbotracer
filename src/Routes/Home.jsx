import { Container, Row, Col } from "react-bootstrap";
import Avarages from "../Components/Avarages";
import DownloadChats from "../Components/DownloadChats";

function Home() {
  return (
    <>
      <Container className="bg-light">
        <Row>
          <Col xs={12} md={12}>
            <Avarages />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <DownloadChats />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
