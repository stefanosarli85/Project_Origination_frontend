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
  const [isDownloading, setIsDownloading] =
  useState(false);

  // Fetch reports from backend
  useEffect(() => {
   const fetchReports = async () => {
  try {
    setReportData(null);   // clear old company report
    setIsLoading(true);

    const formData = new FormData();
        // FIXED: backend expects batch payload
        formData.append("company_code", JSON.stringify(companyCodes));

       const response = await fetch(
  "https://backend.formula-cf-ai.com/api/india/get-report",
  {
    method: "POST",
    body: formData,
  }
);
        const json = await response.json();
        console.log("API RESPONSE:", json);

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
  }, [companyCodes?.[0]]);


  const handleDownload = async () => {
  try {
    setIsDownloading(true);

    const selectedCode =
      companyCodes?.[0];

    const response = await fetch(
      `https://backend.formula-cf-ai.com/api/Fetch-financial-document/${selectedCode}`
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const data = await response.json();

    const fileUrl = data.s3_url;

    const link =
      document.createElement("a");

    link.href = fileUrl;
    link.download =
      "financial-report.pdf";
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    alert("Failed to download file");
  } finally {
    setIsDownloading(false);
  }
};

  if (isLoading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          border: "5px solid #dbeafe",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <h2
        style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        Loading Financial Reports...
      </h2>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        Please wait while we fetch company data.
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

  if (isError) {
    return <h2 style={{ padding: "20px" }}>Error Fetching Reports</h2>;
  }

  // If backend fails
  if (!reportData?.success) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No Financial Report Data Found</h2>
        <p>{reportData?.error || "Unknown API error"}</p>
      </div>
    );
  }const selectedCode = companyCodes?.[0];

const report = reportData?.reports?.find(
  (item) => String(item.company_code) === String(selectedCode)
);

const companyName =
  reportData?.companies?.[selectedCode];

  if (!report) {
    return <h2 style={{ padding: "20px" }}>No Report Available</h2>;
  }

  // Excel-like styles
  const thStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "10px",
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "28px",
      fontWeight: "700",
      color: "#0f172a",
    }}
  >
    Financial Report Dashboard
  </h1>

  <button
    onClick={handleDownload}
    disabled={isDownloading}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 18px",
      background: isDownloading
        ? "#94a3b8"
        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: isDownloading
        ? "not-allowed"
        : "pointer",
      boxShadow:
        "0 4px 12px rgba(37,99,235,0.25)",
    }}
  >
    {isDownloading ? (
      <>
        <span
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid #fff",
            borderTop:
              "2px solid transparent",
            borderRadius: "50%",
            animation:
              "spin 0.8s linear infinite",
          }}
        />
        Downloading...
      </>
    ) : (
      <>⬇ Download Report</>
    )}
  </button>
</div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Metric</th>

            {report?.periods?.map((period) => (
              <th key={period} style={thStyle}>
                {period.split("|")[1]}
              </th>
            ))}

            <th style={thStyle}>Insight / Status</th>
          </tr>
        </thead>

        <tbody>
          {/* Company Info */}
          <tr>
            <td style={tdStyle}>Company Info</td>
            <td style={tdStyle}>Company Name</td>
            <td style={tdStyle}>{companyName}</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>Active</td>
          </tr>

          <tr>
            <td style={tdStyle}>Company Info</td>
            <td style={tdStyle}>Company Code</td>
            <td style={tdStyle}>{companyCodes[0]}</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>Selected</td>
          </tr>

          <tr>
            <td style={tdStyle}>Company Info</td>
            <td style={tdStyle}>Report Type</td>
            <td style={tdStyle}>{report?.report_name}</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>Success</td>
          </tr>

          {/* Financial Data */}
          {report?.data?.map((item) => {
            const firstYear = report.periods[0];
            const lastYear = report.periods[2];

            const firstValue = item.values[firstYear];
            const lastValue = item.values[lastYear];

            return (
              <tr key={item.expression}>
                <td style={tdStyle}>Financials</td>
                <td style={tdStyle}>{item.expression}</td>

                {report.periods.map((period) => (
                  <td key={period} style={tdStyle}>
                    {item.values[period] ?? "-"}
                  </td>
                ))}

                <td style={tdStyle}>
                  {lastValue > firstValue
                    ? "Increasing"
                    : lastValue < firstValue
                    ? "Decreasing"
                    : "Stable"}
                </td>
              </tr>
            );
          })}

          {/* M&A Insight */}
          <tr>
            <td style={tdStyle}>M&A Insight</td>
            <td style={tdStyle}>Acquisition Potential</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>Potential Strong Candidate</td>
          </tr>

          {/* Data Quality */}
          <tr>
            <td style={tdStyle}>Data Quality</td>
            <td style={tdStyle}>Source</td>
            <td style={tdStyle}>Financial API</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>-</td>
            <td style={tdStyle}>High Confidence</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
