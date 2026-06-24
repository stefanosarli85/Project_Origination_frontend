import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import GppGoodIcon from "@mui/icons-material/GppGood";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
  style={{
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#111827",
  }}
>
  Company Search Platform TEST
</h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
            marginBottom: "40px",
          }}
        >
          Search, analyze and verify companies worldwide
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            display: "flex",
          }}
        >
          {/* Search Companies */}
          <div
            onClick={() => {
  sessionStorage.removeItem("currentStep");
  sessionStorage.removeItem("currentRegion");
  navigate("/search-companies");
}}
            style={{
              flex: 1,
              background:
                "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#fff",
              padding: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "0.3s",
            }}
          >
            <SearchIcon />
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Search Companies
              </div>

              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.9,
                }}
              >
              
              </div>
            </div>
          </div>

          {/* KYC Check */}
          <div
         onClick={() => navigate("/kyc-region")}
            style={{
              flex: 1,
              background: "#fff",
              color: "#374151",
              padding: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <div
         onClick={() => navigate("/kyc-region-select")}
            style={{
              flex: 1,
              background: "#fff",
              color: "#374151",
              padding: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              borderLeft: "1px solid #e5e7eb",
            }}
          ></div>
            <GppGoodIcon
              style={{
                color: "#16a34a",
              }}
            />

            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                KYC Check
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;