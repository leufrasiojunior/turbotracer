import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../ApiConnect/connect";
import { Container } from "react-bootstrap";
import { BsCalendar } from "react-icons/bs";
import Loader from "./Spinner";
import DatePickers from "./ChartsHome/DatePickers";
import TimezoneSelect from "./ChartsHome/TimezoneSelect";
import { LoadMoreButton, ResetButton } from "./ChartsHome/TopButtons";
import ChartComponent from "./ChartsHome/ChartComponent";

const DownloadChats = () => {
  const [dados, setDados] = useState([]);
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [fusoHorario, setFusoHorario] = useState("UTC");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [numResultados, setNumResultados] = useState(10);
  const [prevResults, setPrevResults] = useState(0);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dataAtual = moment();
      const diferencaUTCMinutos = dataAtual.utcOffset();

      const dataInicioUTC = moment(dataInicio)
        .startOf("day")
        .subtract(diferencaUTCMinutos, "minutes");

      const dataFimUTC = moment(dataFim)
        .endOf("day")
        .subtract(diferencaUTCMinutos, "minutes");

      const dataInicioFormatada = dataInicioUTC.format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      const dataFimFormatada = dataFimUTC.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      const dataAtualFormatada = dataAtual
        .subtract(diferencaUTCMinutos, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      const resposta = await api.get("/data", {
        params: {
          inicio: dataInicioFormatada,
          fim: dataFimFormatada,
          horaAtual: dataAtualFormatada,
        },
      });
      setDados(resposta.data);
    } catch (erro) {
      setErro("Erro ao buscar dados. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }, [dataInicio, dataFim]);

  const setTimeZone = async () => {
    const timeZone = await api.get("/settings");
    setFusoHorario(timeZone.data.timezone.payload);
  };

  useEffect(() => {
    setTimeZone();
    buscarDados();
  }, [buscarDados]);

  const handleStartDateChange = (date) => {
    setDataInicio(date);
  };

  const handleEndDateChange = (date) => {
    setDataFim(date);
  };

  const handleBuscarClick = () => {
    buscarDados();
  };

  const handleMostrarMais = () => {
    if (numResultados >= dados.length) {
      setNumResultados(numResultados);
    } else {
      setPrevResults((antigo) => antigo + numResultados - prevResults);
      setNumResultados((prev) => prev + 10);
    }
  };
  const handleReset = () => {
    setNumResultados(10);
    setPrevResults(0);
  };

  // const dadosLimitados = dados.slice(0, numResultados);
  const dadosLimitados = dados.slice(prevResults, numResultados);
  // TODO
  // Ajustar o botão de ver mais para Próxima Página
  // Ajustar o botão de zerar para reduzir a página
  return (
    <Container>
      <Container
        className="d-flex flex-row align-content-between flex-wrap align-items-center justify-content-between p-4 rounded-3"
        style={{ textAlignLast: "center" }}
      >
        <BsCalendar />
        <DatePickers
          dataInicio={dataInicio}
          dataFim={dataFim}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
        />
        <LoadMoreButton
          handleMostrarMais={handleMostrarMais}
          dados={dados}
          dadosLimitados={dadosLimitados}
          numResultados={numResultados}
        />
        <ResetButton
          handleReset={handleReset}
          dados={dados}
          dadosLimitados={dadosLimitados}
        />
        <Container className="w-25">
          <button className="btn btn-light" onClick={handleBuscarClick}>
            Buscar
          </button>
        </Container>
      </Container>
      {carregando ? (
        <Container>
          <Loader />
        </Container>
      ) : erro ? (
        <Container className="text-center text-danger">{erro}</Container>
      ) : (
        <>
          <Container className="d-flex gap-4 flex-column text-center">
            <ChartComponent
              data={dadosLimitados}
              fusoHorario={fusoHorario}
              title="Download (Mbps)"
              dataKey="download"
              yAxisLabel="Download (Mbps)"
            />
            <ChartComponent
              data={dadosLimitados}
              fusoHorario={fusoHorario}
              title="Upload (Mbps)"
              dataKey="upload"
              yAxisLabel="Upload (Mbps)"
            />
            <ChartComponent
              data={dadosLimitados}
              fusoHorario={fusoHorario}
              title="Ping(ms)"
              dataKey="ping"
              yAxisLabel="Ping (ms)"
            />
          </Container>
        </>
      )}
    </Container>
  );
};

export default DownloadChats;
