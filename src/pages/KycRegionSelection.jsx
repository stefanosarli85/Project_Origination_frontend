import { useNavigate } from "react-router";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const KycRegionSelection = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "50px" }}>
          <VerifiedUserIcon
            style={{
              fontSize: "70px",
              color: "#2563eb",
            }}
          />

          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "10px",
            }}
          >
            KYC Verification
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
            }}
          >
            Choose the region for verification
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          {/* Global */}
          <div
            onClick={() => navigate("/kyc-check")}
            style={{
              width: "350px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              cursor: "pointer",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              transition: "0.3s",
            }}
          >
            <PublicIcon
              style={{
                fontSize: "80px",
                color: "#2563eb",
              }}
            />

            <h2
              style={{
                marginTop: "20px",
                color: "#111827",
              }}
            >
              Global KYC
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Verify individuals and companies
              across multiple countries and
              international databases.
            </p>
          </div>

          {/* Italy */}
          <div
            onClick={() => navigate("/italy-kyc")}
            style={{
              width: "350px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              cursor: "pointer",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              transition: "0.3s",
            }}
          >
            <LocationCityIcon
              style={{
                fontSize: "80px",
                color: "#16a34a",
              }}
            />

            <h2
              style={{
                marginTop: "20px",
                color: "#111827",
              }}
            >
              Italy KYC
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              Verify Italian companies and
              individuals using Italy-specific
              compliance and registry sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycRegionSelection;