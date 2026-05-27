import { useLocation, Link } from "react-router";

const SelectedCompanies = () => {
  const location = useLocation();
  const selectedCompanies = location.state?.selectedCompanies || [];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Selected Companies</h1>
      <Link to="/">← Back To Table</Link>
      <br />
      <br />
      {selectedCompanies.length === 0 ? (
        <p>No companies selected</p>
      ) : (
        selectedCompanies.map((company) => (
          <div
            key={company.companyCode}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <h2>{company.companyName}</h2>
            <p>
              <strong>Industry:</strong> {company.industry}
            </p>
            <p>
              <strong>Symbol:</strong> {company.symbol}
            </p>
            <p>
              <strong>PAT 2025:</strong> {company.pat2025}
            </p>
            <p>
              <strong>Total Income:</strong> {company.totalIncome2025}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default SelectedCompanies;
