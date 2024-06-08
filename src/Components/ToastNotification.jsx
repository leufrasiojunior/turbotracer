/* eslint-disable react/prop-types */
import { Toast, ToastContainer } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ToastNotification = ({ show, onClose, message, variant }) => {
  const Icon = variant === "success" ? FaCheckCircle : FaTimesCircle; //

  return (
    <ToastContainer position="top-end" className="top-0 end-0 p-3">
      <Toast show={show} onClose={onClose} delay={3000} autohide>
        <Toast.Header>
          <Icon
            className={
              variant === "success" ? "text-success me-2" : "text-danger me-2"
            }
          />
          <strong className="me-auto">
            {variant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
