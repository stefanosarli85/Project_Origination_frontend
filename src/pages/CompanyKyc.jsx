import { useState } from "react";
import { useNavigate } from "react-router";

const CompanyKyc = () => {
  const [companyName, setCompanyName] = useState("");
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
  type: "company",
  name: companyName,
}),
        }
      );

      const result = await response.json();

      console.log("COMPANY KYC RESULT", result);
      navigate("/company-kyc-result", {
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
        <h2 className="mb-4">Company KYC Check</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Company Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
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
      </div>
    </div>
  );
};

export default CompanyKyc;