/* eslint-disable react/prop-types */
import { BsFiletypeCsv } from "react-icons/bs";

const ExportButton = ({ exportToCsv }) => {
  return (
    <button
      className="btn btn-secondary buttons-copy buttons-html5"
      onClick={exportToCsv}
    >
      <BsFiletypeCsv style={{ marginRight: "5px" }} />
      Export as CSV
    </button>
  );
};

export default ExportButton;
