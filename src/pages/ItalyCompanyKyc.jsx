
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ItalyCompanyKyc = () => {
  const [companyName, setCompanyName] = useState("");
  const [vatCode, setVatCode] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [requests, setRequests] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://43.205.207.160:1701/api/italy/comp/retrieve-kyc-requests"
      );

      const data = await response.json();

      console.log("REQUESTS:", data);

      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch requests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://43.205.207.160:1701/api/italy/comp/request-kyc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: companyName,
            vat_code: vatCode,
            tax_code: taxCode,
          }),
        }
      );

      const result = await response.json();

      console.log("STATUS:", response.status);
      console.log("KYC RESULT:", result);

      if (response.ok) {
        toast.success("Request Submitted Successfully");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit request");
    }
  };

  const handleDownload = async (requestId) => {
  setDownloadingId(requestId);

  try {
    const response = await fetch(
      `http://43.205.207.160:1701/api/italy/comp/download-kyc-pdf/${requestId}`
    );

    const contentType =
      response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (data.status === "processing") {
        toast.info(
          "Report is still being generated. Please come back later."
        );
        return;
      }

      toast.info(
        data.message || "Unable to download report."
      );
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `Company_KYC_${requestId}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Download Started");
  } catch (error) {
    console.error("Download Error:", error);
    toast.error("Failed to download report");
  } finally {
    setDownloadingId(null);
  }
};

  return (
    <div className="container py-5">
      {/* Form Card */}
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="mb-4">
          Italy Company KYC Check
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Company Name</label>

            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label>VAT Code</label>

            <input
              type="text"
              className="form-control"
              value={vatCode}
              onChange={(e) =>
                setVatCode(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label>Tax Code</label>

            <input
              type="text"
              className="form-control"
              value={taxCode}
              onChange={(e) =>
                setTaxCode(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Table Card */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "30px auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="mb-3">
          Previous Company KYC Requests
        </h3>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Company Name</th>
              <th>VAT Code</th>
              <th>Tax Code</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.length > 0 ? (
              requests.map((item) => (
                <tr key={item.request_id}>
                  <td>{item.request_id}</td>
                  <td>{item.company_name}</td>
                  <td>{item.vat_code}</td>
                  <td>{item.tax_code}</td>
                  <td>{item.created_at}</td>

                  <td>
                    <button
  type="button"
  className="btn btn-success btn-sm"
  disabled={downloadingId === item.request_id}
  onClick={() =>
    handleDownload(item.request_id)
  }
>
  {downloadingId === item.request_id ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
      ></span>
      Downloading...
    </>
  ) : (
    "Download"
  )}
</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItalyCompanyKyc;

