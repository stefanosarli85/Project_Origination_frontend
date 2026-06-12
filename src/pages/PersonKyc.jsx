import { useState } from "react";
import { useNavigate } from "react-router";

const PersonKyc = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://43.205.207.160:1701/api/global/kyc-check",
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
console.log("DATA SENT TO RESULT PAGE", result.data);

    navigate("/kyc-result", {
  state: result.data,
});
  } catch (error) {
    console.error(error);
  }
};






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



      </div>
    </div>
  );
};

export default PersonKyc;