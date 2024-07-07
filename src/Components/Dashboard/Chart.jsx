import { useState, useEffect } from "react";
import { BarChart } from "react-google-charts";
import api from "../../ApiConnect/connect";

const LocationTests = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/getlocations");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div>
      {data.location && <h2>{data.location}</h2>}
      {data.totalTests > 0 && (
        <BarChart
          width={400}
          height={300}
          data={[["Testes", data.totalTests]]}
          options={{
            title: "Total de Testes",
            hAxis: { title: "Testes" },
            vAxis: { title: "Quantidade" },
          }}
        />
      )}
    </div>
  );
};

export default LocationTests;
