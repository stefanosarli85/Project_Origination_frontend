import { useLocation, useNavigate } from "react-router";
import { FaBuilding } from "react-icons/fa";
import { HiOutlineNewspaper } from "react-icons/hi";
import { MdOutlineDateRange } from "react-icons/md";

const CompanyNews = () => {
  
  const location = useLocation();
console.log("CURRENT PATH:", location.pathname);
const navigate = useNavigate();

  const newsData = location.state;

  if (!newsData) {
    return (
      <div className="container py-5">
        <h3>No news data found.</h3>

       <button
  onClick={() => {
    console.log("BACK CLICKED");
    navigate("/search-companies");
  }}
>
  Back
</button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* Header Card */}
      <div
  style={{
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    marginBottom: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "15px",
    }}
  >
    <FaBuilding
      size={40}
      color="#2563eb"
    />

    <h1
      style={{
        margin: 0,
        color: "#0f172a",
        fontWeight: "700",
      }}
    >
      {newsData.company_name}
    </h1>
  </div>

  <div
    style={{
      display: "flex",
      gap: "30px",
      color: "#475569",
      fontSize: "15px",
    }}
  >
    <span>
      <HiOutlineNewspaper
        style={{
          marginRight: "5px",
        }}
      />
      {newsData.total_articles} Articles Found
    </span>

    <span>
      <MdOutlineDateRange
        style={{
          marginRight: "5px",
        }}
      />
      Updated{" "}
      {new Date(
        newsData.search_timestamp
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  </div>
</div>
      {/* News Cards */}
      {newsData.articles?.map((article, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
          <h3
  style={{
    marginBottom: "8px",
    color: "#0f172a",
  }}
>
  {article.title}
</h3>

<p
  style={{
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "12px",
  }}
>
  <MdOutlineDateRange
    style={{ marginRight: "5px" }}
  />
  {article.published?.split(" ").slice(1, 4).join(" ")}
</p>

            <p
              style={{
                color: "#475569",
                marginBottom: "15px",
              }}
            >
              {article.summary
                ?.replace(/<[^>]*>/g, "")
                ?.replace(/&nbsp;/g, " ")}
            </p>

  <div style={{ marginTop: "10px" }}>
    {article.matched_categories.map(
      (category, index) => (
        <span
          key={index}
          style={{
            background: "#dbeafe",
            color: "#1d4ed8",
            padding: "5px 10px",
            borderRadius: "20px",
            marginRight: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {category}
        </span>
      )
    )}
  </div>


{article.matched_keywords?.length > 0 && (
  <div style={{ marginTop: "10px" }}>
    {article.matched_keywords.map(
      (keyword, index) => (
        <span
          key={index}
          style={{
            background: "#f1f5f9",
            color: "#334155",
            padding: "5px 10px",
            borderRadius: "20px",
            marginRight: "8px",
            fontSize: "12px",
          }}
        >
          #{keyword}
        </span>
      )
    )}
  </div>
)}

{article.priority_score > 0 && (
  <div
    style={{
      marginTop: "10px",
      color: "#dc2626",
      fontWeight: "600",
    }}
  >
    Priority Score: {article.priority_score}
  </div>
)}
            
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "12px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            Read More ↗
          </a>
        </div>
      ))}

      <button
  onClick={() => navigate("/search-companies")}
  style={{
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#64748b",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Back
</button>
    </div>
  );
};

export default CompanyNews;