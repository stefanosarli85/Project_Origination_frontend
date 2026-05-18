import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router";

const ReportsPage = () => {
  const location = useLocation();

  const companyCodes = useMemo(
    () => location.state?.companyCodes || [],
    [location.state?.companyCodes],
  );

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        // create form data
        const formData = new FormData();
        formData.append("company_code", JSON.stringify(companyCodes));
        const response = await fetch(
          "http://43.205.207.160:1701/api/itly/get-report",
          {
            method: "POST",
            body: formData,
          },
        );
        const json = await response.json();
        console.log(json);
        setReportData(json);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyCodes.length > 0) {
      fetchReports();
    }
  }, [companyCodes]);

  if (isLoading) {
    return <h2>Loading Reports...</h2>;
  }

  if (isError) {
    return <h2>Error Fetching Reports</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Financial Reports</h1>
      <h3>Selected Company Codes:</h3>
      <pre>{JSON.stringify(companyCodes, null, 2)}</pre>
      <h3>Backend Response:</h3>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "20px",
          overflow: "auto",
          maxHeight: "600px",
        }}
      >
        {JSON.stringify(reportData, null, 2)}
      </pre>
    </div>
  );
};

export default ReportsPage;
