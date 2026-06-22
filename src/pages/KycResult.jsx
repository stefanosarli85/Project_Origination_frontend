import { useLocation } from "react-router";
import { useState } from "react";


const KycResult = () => {
  const location = useLocation();
  const records = location.state || [];
  const [tableData, setTableData] = useState(records);

  console.log(records);
  const handleDownload = (row) => {
  const entities = row.raw_response?.entities || [];

  if (!entities.length) return;

  const highestEntity = entities.reduce(
    (max, current) =>
      current.matchScore > max.matchScore
        ? current
        : max,
    entities[0]
  );

  const entityId = highestEntity.id;

  const pdfUrl =
    `https://backend.formula-cf-ai.com/api/global/kyc/${row.request_id}/${entityId}/pdf`;

  window.open(pdfUrl, "_blank");
};
const recheckStatus = async (requestId) => {
  try {
    const response = await fetch(
      `https://backend.formula-cf-ai.com/api/global/kyc/${requestId}?entity_type=individual`
    );

    const data = await response.json();

    console.log("RECHECK RESPONSE", data);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="container mt-4">
      <h2>KYC Results</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birth Date</th>
            <th>State</th>
            <th>Entities Count</th>
            <th>Evidences Count</th>
            <th>Comment</th>
            <th>Download</th>
          </tr>
        </thead>

        <tbody>
        {tableData.map((row) => {
            const entities =
              row.raw_response?.entities || [];

            const evidences =
              row.raw_response?.evidences || [];

            const hasRecords =
              entities.length > 0 ||
              evidences.length > 0;

            return (
              <tr key={row.request_id}>
                <td>{row.request_id}</td>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.birth_date}</td>
                <td>{row.state}</td>
                <td>{row.entities_count}</td>
                <td>{row.evidences_count}</td>

                {row.state === "COMPLETED" ? (
                  <>
                    <td>
                      {hasRecords
                        ? "Record Found"
                        : "Record Not Found"}
                    </td>

                    <td>
                      <button
  disabled={!hasRecords}
  className={`btn ${
    hasRecords
      ? "btn-success"
      : "btn-secondary"
  }`}
  onClick={() => handleDownload(row)}
>
  Record Found
</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td colSpan="2">
                  <button
  className="btn btn-warning"
  onClick={() => recheckStatus(row.request_id)}
>
  Recheck Status
</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KycResult;