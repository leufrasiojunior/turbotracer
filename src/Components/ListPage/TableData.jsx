import { bpsToMbps } from "../../functions/bpsToMbps";

const TableData = ({
  results,
  handleCheckboxChange,
  selectedItems,
  handleRowClick,
  selectAll,
  setSelectAll,
}) => {
  return (
    <table
      className="table dataTable no-footer table-hover text-center"
      style={{ width: "100%" }}
    >
      <thead className="thead-light table-bordered">
        <tr role="row">
          <th
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCheckboxChange("selectAll", {
                target: { checked: !selectAll },
              })
            }
          >
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(event) => handleCheckboxChange("selectAll", event)}
            />
          </th>
          <th>ID</th>
          <th>Download</th>
          <th>Upload</th>
          <th>Ping</th>
          <th>Status</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {results &&
          results.map((item) => (
            <tr
              key={item.id}
              onClick={(event) =>
                item.status === "failed"
                  ? null
                  : item.status === "started"
                  ? null
                  : handleRowClick(item.id, event)
              }
              style={{ cursor: "pointer" }}
            >
              <td
                id="box"
                onClick={(event) => handleCheckboxChange(item.id, event)}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(event) => handleCheckboxChange(item.id, event)}
                />
              </td>
              <td>{item.id ?? ""}</td>
              <td>
                {item.download != null
                  ? bpsToMbps(item.download * 8).toFixed(2)
                  : ""}
              </td>
              <td>
                {item.upload != null
                  ? bpsToMbps(item.upload * 8).toFixed(2)
                  : ""}
              </td>
              <td>{item.ping != null ? item.ping.toFixed(2) : ""}</td>
              <td>
                <div className="w-auto">
                  <div className="d-flex justify-content-center">
                    <span
                      className={
                        item.status === "completed"
                          ? "ring-inset CustomFontSize ring-1 ring-custom-600/10 custom-success-text custom-success-bg pb-1 pt-1 px-2"
                          : item.status === "failed"
                          ? "text-custom-600 ring-inset ring-1 bg-custom-50 ring-custom-600/10 CustomFontSize pb-1 pt-1 px-2"
                          : item.status === "started"
                          ? "text-custom-600 ring-inset CustomFontSize ring-1 ring-custom-600/10 custom-success-text custom-success-bg pb-1 pt-1 px-2"
                          : "text-custom-600"
                      }
                      style={{
                        borderRadius: ".375rem",
                        "--c-50":
                          item.status === "completed"
                            ? "var(--success-50)"
                            : item.status === "failed"
                            ? "var(--danger-50)"
                            : item.status === "started"
                            ? "var(--warning-50)"
                            : "",
                        "--c-400":
                          item.status === "completed"
                            ? "var(--success-400)"
                            : item.status === "failed"
                            ? "var(--danger-400)"
                            : item.status === "started"
                            ? "var(--warning-400)"
                            : "",
                        "--c-600":
                          item.status === "completed"
                            ? "var(--success-600)"
                            : item.status === "failed"
                            ? "var(--danger-600)"
                            : item.status === "started"
                            ? "var(--warning-600)"
                            : "",
                      }}
                    >
                      {item.status ?? ""}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                {item.created_at != null
                  ? new Date(item.created_at).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TableData;
