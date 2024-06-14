import { useEffect, useMemo, useState } from "react";
import api from "../ApiConnect/connect";
import moment from "moment-timezone";
import TimezoneSelect from "../Components/TimezoneSelect";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import ToastNotification from "../Components/ToastNotification";
import { Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";

function Settings() {
  const opcoesFusoHorario = useMemo(
    () => moment.tz.names().map((tz) => ({ value: tz, label: tz })),
    []
  );

  const [fusoHorario, setFusoHorario] = useState("UTC");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pruneData, setPruneData] = useState("");
  const [scheduleTest, setScheduleTest] = useState("");
  const [isLoading, setIsLoading] = useState();

  const handleTimezoneChange = (selectedOption) => {
    setFusoHorario(selectedOption.value);
  };

  const handleOtherSettings = (e) => {
    if (e.target.name === "prune") {
      setPruneData(e.target.value);
    }
    if (e.target.name === "schedule") {
      setScheduleTest(e.target.value);
    }
  };

  const saveConfigs = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const payloadSettings = {
      timezone: fusoHorario,
      pruneData: pruneData,
      scheduleTest: scheduleTest,
    };
    if (pruneData) {
      payloadSettings.pruneData = pruneData;
    }
    if (scheduleTest) {
      payloadSettings.scheduleTest = scheduleTest;
    }
    console.log("Payload:", payloadSettings);
    api
      .post("/settings", payloadSettings)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setShowSuccessToast(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(error.message || "Something went wrong");
        }
        setShowErrorToast(true);
      });
  };

  useEffect(() => {
    api
      .get("/settings")
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setScheduleTest(response.data.scheduleTest.payload);
          setFusoHorario(response.data.timezone.payload);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || "Something went wrong");
        setShowErrorToast(true);
      });
  }, []);

  return (
    <Container
      fluid
      className="d-flex flex column vh-100 justify-content-center align-items-center "
    >
      <Card style={{ width: "80rem" }} className="">
        <Card.Header>General Settings</Card.Header>
        <Card.Body>
          <Form className="p-4 rounded-5">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSpeedtestSchedule">
                <Form.Label>Speedtest schedule</Form.Label>
                <InputGroup>
                  <FormControl
                    type="text"
                    className="shadow-sm"
                    onChange={handleOtherSettings}
                    name="schedule"
                    value={scheduleTest}
                  />
                  <InputGroup.Text
                    style={{ backgroundColor: "#FFF" }}
                    className="shadow-sm"
                  >
                    <a
                      href="https://crontab.cronhub.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cron Generator
                    </a>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  Leave empty to disable scheduled tests.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formPruneResults">
                <Form.Label>Prune results older than</Form.Label>
                <InputGroup>
                  <FormControl
                    type="number"
                    placeholder="0"
                    className="shadow-sm"
                    onChange={handleOtherSettings}
                    name="prune"
                  />
                  <InputGroup.Text
                    className="shadow-sm"
                    style={{ backgroundColor: "#FFF" }}
                  >
                    days
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  Set to zero to disable pruning.
                </Form.Text>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSpeedtestServers">
                <Form.Label>Timezone Select</Form.Label>
                <TimezoneSelect
                  options={opcoesFusoHorario}
                  onChange={handleTimezoneChange}
                  className="shadow-sm"
                  enableShadow={true}
                  defaultValue={{ value: fusoHorario, label: fusoHorario }}
                />
              </Form.Group>
            </Row>
            <Container className="d-flex justify-content-center align-items-center">
              <Button onClick={saveConfigs} disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Save"}
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
      <ToastNotification
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message="Settings saved successfully!"
        variant="success"
      />
      <ToastNotification
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        message={errorMessage || "Error message"}
        variant="error"
      />
    </Container>
  );
}

export default Settings;
