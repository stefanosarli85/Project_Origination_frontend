import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const PersonKyc = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [kycResults, setKycResults] = useState([]);
  const [kycResult, setKycResult] = useState(null);
  const navigate = useNavigate();


  const loadKycRequests = async () => {
    try {
      const response = await fetch(
        "https://backend.formula-cf-ai.com/api/kyc/individual"
      );

      const data = await response.json();

      setKycResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadKycRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
  "https://backend.formula-cf-ai.com/api/global/kyc",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },                                                                                                                                                                                                                                                                                                                            
    body: JSON.stringify({
      query: {
        firstName,
        lastName,
        birthDate,
        entityType: "I",
      },
    }),
  }
);

const result = await response.json();
navigate("/kyc-result", {
  state: result,
});                         


setKycResult(result);

      await loadKycRequests();
    } catch (error) {
      console.error(error);
    }
  };

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

    const pdfUrl = `https://backend.formula-cf-ai.com/api/global/kyc/${row.request_id}/${entityId}/pdf`;

    window.open(pdfUrl, "_blank");
  };
const recheckStatus = async (requestId) => {
  try {
    const response = await fetch(
      `https://backend.formula-cf-ai.com/api/global/kyc/${requestId}?entity_type=individual`
    );

    const updatedRow = await response.json();

    setKycResults((prev) =>
      prev.map((row) =>
        row.request_id === requestId
          ? {
              ...row,
              state: updatedRow.state,
              raw_response: updatedRow,
              entities_count:
                updatedRow.entities?.length || 0,
              evidences_count:
                updatedRow.evidences?.length || 0,
            }
          : row
      )
    );
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="container py-5">

      {/* Form Card */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="mb-4">Person KYC Check</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label>Birth Date</label>
            <input
              type="date"
              className="form-control"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Check KYC
          </button>
        </form>
        {kycResult && (
  <div
    className={`alert mt-3 ${
      (kycResult.entities?.length || 0) === 0 &&
      (kycResult.evidences?.length || 0) === 0
        ? "alert-success"
        : "alert-danger"
    }`}
  >
    {(kycResult.entities?.length || 0) === 0 &&
    (kycResult.evidences?.length || 0) === 0
      ? "✅ CLEAN"
      : "⚠️ FLAGGED"}
  </div>
)}
      </div>

      {/* Table Card */}
      <div
        style={{
          marginTop: "30px",
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="mb-4">
          Previous Individual KYC Requests
        </h3>

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
            {kycResults.map((row) => {
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
                          onClick={() =>
                            handleDownload(row)
                          }
                        >
                          Download Pdf
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

    </div>
  );
};

export default PersonKyc;