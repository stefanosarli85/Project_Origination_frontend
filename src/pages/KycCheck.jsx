import { useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";

const KycCheck = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          KYC Verification
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "50px",
            fontSize: "18px",
          }}
        >
          Select the type of verification you want to perform
        </p>

        <div
          style={{
            display: "flex",
            gap: "30px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Person */}
          <div
            onClick={() => navigate("/kyc-person")}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              transition: "0.3s",
            }}
          >
            <PersonIcon
              style={{
                fontSize: "70px",
                color: "#2563eb",
              }}
            />

            <h3>Person</h3>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Verify individual identity and personal KYC records
            </p>
          </div>

          {/* Company */}
          <div
            onClick={() => navigate("/kyc-company")}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              transition: "0.3s",
            }}
          >
            <BusinessIcon
              style={{
                fontSize: "70px",
                color: "#16a34a",
              }}
            />

            <h3>Company</h3>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Verify business information, ownership and compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycCheck;