import { Container } from "react-bootstrap";
import Avarages from "../Components/Avarages";
import DownloadChats from "../Components/DownloadChats";

function Home() {
  return (
    <>
      <Container className="bg-light">
        <Avarages />
        <DownloadChats />
      </Container>
    </>
  );
}

export default Home;
