import { useState } from "react";
import { useNavigate } from "react-router";

const PersonKyc = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [kycResult, setKycResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://43.205.207.160:1701/api/kyc-check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  type: "person",
  firstName,
  lastName,
  birthDate,
}),
      }
    );
const result = await response.json();

console.log("STATUS:", response.status);
console.log("KYC RESULT:", result);
    navigate("/kyc-result", {
  state: result.data,
});
  } catch (error) {
    console.error(error);
  }
};
  const isClean =
  kycResult &&
  kycResult.entities?.length === 0 &&
  kycResult.evidences?.length === 0;



  return (
    <div className="container py-5">
      <div
        style={{
          maxWidth: "600px",
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
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Birth Date</label>
            <input
              type="date"
              className="form-control"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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
    style={{
      marginTop: "20px",
      padding: "15px",
      borderRadius: "10px",
      background: isClean ? "#dcfce7" : "#fee2e2",
      color: isClean ? "#166534" : "#991b1b",
      fontWeight: "bold",
    }}
  >
    {isClean
      ? "✅ CLEAN"
      : "⚠️ FLAGGED"}
  </div>
)}
{kycResult && (
  <table className="table table-bordered mt-3">
    <tbody>
      <tr>
        <th>Status</th>
        <td>{isClean ? "CLEAN" : "FLAGGED"}</td>
      </tr>
      <tr>
        <th>State</th>
        <td>{kycResult.state}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{kycResult.type}</td>
      </tr>
      <tr>
        <th>Search ID</th>
        <td>{kycResult.id}</td>
      </tr>
    </tbody>
  </table>
)}

      </div>
    </div>
  );
};

export default PersonKyc;