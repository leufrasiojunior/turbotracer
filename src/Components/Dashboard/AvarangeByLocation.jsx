import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import api from "../../ApiConnect/connect";

const LocationChart = () => {
  const [chartData, setChartData] = useState([["Location", "Total Tests"]]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/getlocation");
        let data = response.data;

        // Ordenar os dados por totalTests em ordem decrescentevc 
        data.sort((a, b) => b.totalTests - a.totalTests);

        // Mapear os dados da API para o formato do gráfico
        const mappedData = data.map((locationData) => [
          locationData.location,
          locationData.totalTests,
        ]);

        // Adicionar o cabeçalho dos dados do gráfico
        setChartData([["Location", "Total Tests"], ...mappedData]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from API", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={chartData}
      options={{
        title: "Total Tests by Location",
        hAxis: { title: "Location" },
        vAxis: { title: "Total Tests" },
        chartArea: { width: "50%" },
      }}
    />
  );
};

export default LocationChart;
