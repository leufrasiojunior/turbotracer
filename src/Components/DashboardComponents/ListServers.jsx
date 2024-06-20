import { useEffect, useState } from "react";
import api from "../../ApiConnect/connect";
import { Container, Table } from "react-bootstrap";

function ListServers() {
  const [servers, setServers] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const getServers = async () => {
    try {
      const response = await api.get("/getservers");
      if (response.data) {
        setServers(response.data.serverCounts);
        setTotalResults(response.data.totalResults);
      }
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  useEffect(() => {
    getServers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      style={{
        width: "30rem",
        height: "20rem",
        maxHeight: "calc(100vh - 100px)",
        overflow: "auto",
      }}
    >
      <Table striped bordered hover className="sticky-header">
        <thead>
          <tr>
            <th>Host</th>
            <th>Total Requests</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(servers).map(([host, count], index) => (
            <tr key={index}>
              <td>{host}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Total Results: {totalResults}</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
}

export default ListServers;
