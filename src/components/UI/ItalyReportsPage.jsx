import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

const ItalyReportsPage = () => {
  const location = useLocation();

  const companyCodes = useMemo(
    () => location.state?.companyCodes || [],
    [location.state?.companyCodes]
  );
const schedules =
  location.state?.schedules || [];

console.log("Selected Schedules:", schedules);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDownloading, setIsDownloading] =
  useState(false);

  const BASE_URL = "http://43.205.207.160:1701";

  // API 1 → Check DB
  const checkDb = async (cid) => {
    const response = await fetch(
      `${BASE_URL}/api/italy/check_db/${cid}`
    );
    return await response.json();
  };

  // API 2 → Get Company
  const getCompany = async (cid) => {
    const response = await fetch(
      `${BASE_URL}/api/italy/company/${cid}`
    );
    return await response.json();
  };

  // API 3 → Save Company
  const saveCompany = async (cid) => {
    const response = await fetch(
      `${BASE_URL}/api/italy/company/${cid}`,
      {
        method: "POST",
      }
    );
    return await response.json();
  };
  // Download Button
  const handleDownload = async () => {
    
  try {
    setIsDownloading(true);

    const selectedCode =
      companyCodes?.[0];

    if (!selectedCode) return;

  const response = await fetch(
  `${BASE_URL}/api/fetch-financial-document/${selectedCode}`,
  {
    method: "POST",
  }
);

console.log("STATUS:", response.status);

const data = await response.json();
console.log("DOWNLOAD API:", data);
    const fileUrl = data?.s3_url;

    if (!fileUrl) {
      throw new Error("No file URL found");
    }

    const link =
      document.createElement("a");

    link.href = fileUrl;
    link.setAttribute("download", "");
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);

        const cid = companyCodes[0];
        if (!cid) return;

        // STEP 1 → Check DB
        const checkResponse = await checkDb(cid);
        console.log("CHECK DB:", checkResponse);

        let companyData;

        // STEP 2 → If company exists
        if (checkResponse?.available === true) {
          companyData = await getCompany(cid);
        } else {
          // STEP 3 → Save then Get
          const saveResponse = await saveCompany(cid);
          console.log("SAVE COMPANY:", saveResponse);

          // wait for DB save
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );

          companyData = await getCompany(cid);
        }

        console.log("COMPANY DATA:", companyData);

        setReportData(companyData);
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
    return (
      <h2 style={{ padding: "20px" }}>
        Error Fetching Reports
      </h2>
    );
  }

  // ---------- REAL API DATA ----------
  const company = reportData?.data?.company || {};

  

  // Financial Overview
 
  const thStyle = {
  padding: "14px 16px",
  background: "#f8fafc",
  borderBottom: "2px solid #dbeafe",
  color: "#1e293b",
  fontWeight: "700",
  textAlign: "left",
  fontSize: "14px",
};
  const tdStyle = {
  padding: "13px 16px",
  borderBottom: "1px solid #edf2f7",
  color: "#334155",
  fontSize: "14px",
  background: "#ffffff",
};
const scheduleReportData =
  location.state?.reportData || null;

console.log(
  "SCHEDULE API RESPONSE",
  scheduleReportData
);
const renderYearData = (obj, yearsArray) =>
  yearsArray.map((year) => (
    <td key={year} style={tdStyle}>
      {obj?.[year] != null
        ? Number(obj[year]).toLocaleString("en-US")
        : "-"}
    </td>
  ));
   

const incomeData = {
  operatingRevenue: {},
  otherRevenue: {},
  totalProductionValue: {},
  totalProductionCost: {},
  purchaseCost: {},
  serviceCost: {},
  thirdPartyAssetCost: {},
  employeeCost: {},
  otherOperatingExpenses: {},
  ebitda: {},
  depreciation: {},
  ebit: {},
  financialCharges: {},
  profitBeforeTax: {},
  tax: {},
  netProfit: {},
  cashFlow: {},
};
const schedule10 =
  scheduleReportData?.data?.["10"] || {};
const schedule10Years = Object.keys(schedule10)
  .sort((a, b) => a - b);
Object.entries(schedule10).forEach(
  ([year, item]) => {
    incomeData.operatingRevenue[year] =
      item.RICAVI_OPERATIVI;

    incomeData.otherRevenue[year] =
      item.RICAVI_E_PROVENTI;

    incomeData.totalProductionValue[year] =
      item.TOTALE_VALORE_DELLA_PRODUZIONE;

    incomeData.totalProductionCost[year] =
      item.TOTALE_COSTI_DELLA_PRODUZIONE;

    incomeData.purchaseCost[year] =
      item.COSTO_PER_ACQUISTI;

    incomeData.serviceCost[year] =
      item.COSTO_PER_SERVIZI;

    incomeData.thirdPartyAssetCost[year] =
      item.COSTO_PER_GODIMENTO_DI_BENI_DI_TERZI;

    incomeData.employeeCost[year] =
      item.COSTO_DEL_PERSONALE;

    incomeData.otherOperatingExpenses[year] =
      item.ONERI_DIVERSI_DI_GESTIONE;

    incomeData.ebitda[year] =
      item.MARGINE_OPERATIVO_LORDO_EBITDA;

    incomeData.depreciation[year] =
      item.AMMORTAMENTI_E_SVALUTAZIONI;

    incomeData.ebit[year] =
      item.RISULTATO_OPERATIVO_EBIT;

    incomeData.financialCharges[year] =
      item.PROVENTI_E_ONERI_FINANZIARI;

    incomeData.profitBeforeTax[year] =
      item.RISULTATO_PRIMA_DELLE_IMPOSTE;

    incomeData.tax[year] =
      item.IMPOSTE_SUL_REDDITO_ESERCIZIO;

    incomeData.netProfit[year] =
      item.UTILE_PERDITA_ESERCIZIO;

    incomeData.cashFlow[year] =
      item.FLUSSO_DI_CASSA;
  }
);

const assetsTableData = {
  intangibleAssets: {},
  tangibleAssets: {},
  totalFixedAssets: {},
  totalReceivables: {},
  receivables12Months: {},
  cashEquivalents: {},
  currentAssets: {},
  accruedAssets: {},
  totalAssets: {},
};

const schedule20 =
  scheduleReportData?.data?.["20"] || {};
  const schedule20Years = Object.keys(schedule20)
  .sort((a, b) => a - b);
  Object.entries(schedule20).forEach(
  ([year, item]) => {
    assetsTableData.intangibleAssets[year] =
      item.IMMOBILIZZAZIONI_IMMATERIALI;

    assetsTableData.tangibleAssets[year] =
      item.IMMOBILIZZAZIONI_MATERIALI;

    assetsTableData.totalFixedAssets[year] =
      item.TOTALE_IMMOBILIZZAZIONI;

    assetsTableData.totalReceivables[year] =
      item.TOTALE_CREDITI;

    assetsTableData.receivables12Months[year] =
      item.CREDITI_ENTRO_12_MESI;

    assetsTableData.cashEquivalents[year] =
      item.TOTALE_DISPONIBILITA_LIQUIDE;

    assetsTableData.currentAssets[year] =
      item.TOTALE_ATTIVO_CIRCOLANTE;

    assetsTableData.accruedAssets[year] =
      item.RATEI_E_RISCONTI_ATTIVI;

    assetsTableData.totalAssets[year] =
      item.TOTALE_ATTIVO;
  }
);

const liabilitiesTableData = {
  netWorth: {},
  shareCapital: {},
  reserves: {},
  retainedEarnings: {},
  provisions: {},
  employeeSeveranceFund: {},
  totalPayables: {},
  payables12Months: {},
  accruedLiabilities: {},
  totalLiabilities: {},
};
const ratioData = {
  roe: {},
  roi: {},
  ros: {},
  currentRatio: {},
  quickRatio: {},
  netFinancialPosition: {},
  revenueGrowth: {},
  productionGrowth: {},
  netWorthGrowth: {},
  assetsGrowth: {},
};
const profitabilityData = {
  profit: {},
  employeeCost: {},
  employees: {},
};
const productivityData = {
  revenue: {},
  employeeCost: {},
  employees: {},
};
const growthData = {
  profit: {},
  revenue: {},
  employeeCost: {},
  employees: {},
};
const schedule30 =
  scheduleReportData?.data?.["30"] || {};
  const schedule30Years = Object.keys(schedule30)
  .sort((a, b) => a - b);
  Object.entries(schedule30).forEach(
  ([year, item]) => {
    liabilitiesTableData.netWorth[year] =
      item.patrimonio_netto;

    liabilitiesTableData.shareCapital[year] =
      item.capitale_sociale;

    liabilitiesTableData.reserves[year] =
      item.altre_riserve;

    liabilitiesTableData.retainedEarnings[year] =
      item.utile_perdita_esercizio;

    liabilitiesTableData.provisions[year] =
      0;

    liabilitiesTableData.employeeSeveranceFund[year] =
      item.fondo_tfr;

    liabilitiesTableData.totalPayables[year] =
      item.totale_debiti;

    liabilitiesTableData.payables12Months[year] =
      item.debiti_entro_12_mesi;

    liabilitiesTableData.accruedLiabilities[year] =
      item.ratei_risconti_passivi;

    liabilitiesTableData.totalLiabilities[year] =
      item.totale_passivo;
  }
);
const schedule40 =
  scheduleReportData?.data?.["40"] || {};
  const ratioYears = Object.keys(schedule40)
  .sort((a, b) => a - b);
  Object.entries(schedule40).forEach(
  ([year, item]) => {
    ratioData.roe[year] = item.perc_roe;
    ratioData.roi[year] = item.perc_roi;
    ratioData.ros[year] = item.perc_ros;

    ratioData.currentRatio[year] =
      item.indice_disponibilita;

    ratioData.quickRatio[year] =
      item.indice_liquidita_immediata;

    ratioData.netFinancialPosition[year] =
      item.pfn;

    ratioData.revenueGrowth[year] =
      item.perc_variazione_ricavi;

    ratioData.productionGrowth[year] =
      item.perc_variazione_valore_produzione;

    ratioData.netWorthGrowth[year] =
      item.perc_variazione_patrimonio_netto;

    ratioData.assetsGrowth[year] =
      item.perc_variazione_attivo;
  }
);
const schedule50 =
  scheduleReportData?.data?.["50"] || {};
  const profitabilityYears = Object.keys(
  schedule50 || {}
).sort((a, b) => Number(a) - Number(b));
Object.entries(schedule50).forEach(
  ([year, item]) => {
    profitabilityData.profit[year] =
      item.utile;

    profitabilityData.employeeCost[year] =
      item.costo_personale;

    profitabilityData.employees[year] =
      item.dipendenti;
  }
);
const schedule60 =
  scheduleReportData?.data?.["60"] || {};
  const productivityYears = Object.keys(
  schedule60 || {}
).sort((a, b) => Number(a) - Number(b));
Object.entries(schedule60).forEach(
  ([year, item]) => {
    productivityData.revenue[year] =
      item.fatturato;

    productivityData.employeeCost[year] =
      item.costo_personale;

    productivityData.employees[year] =
      item.dipendenti;
  }
);
const schedule70 =
  scheduleReportData?.data?.["70"] || {};
  const growthYears = Object.keys(
  schedule70 || {}
).sort((a, b) => Number(a) - Number(b));
Object.entries(schedule70).forEach(
  ([year, item]) => {
    growthData.profit[year] =
      item.utile;

    growthData.revenue[year] =
      item.fatturato;

    growthData.employeeCost[year] =
      item.costo_personale;

    growthData.employees[year] =
      item.dipendenti;
  }
);
const scheduleANA =
  scheduleReportData?.data?.["ANA"] || {};
  const schedulePROT =
  scheduleReportData?.data?.["PROT"] || {};
const schedule05 =
  scheduleReportData?.data?.["05"] || {};
  const schedule85 =
  scheduleReportData?.data?.["85"] || {};

const contacts =
  schedule85?.contatti || {};

const shareholders =
  schedule85?.soci || [];

const managementTeam = [
  ...(schedule85?.ceo_amministratori || []),
  ...(schedule85?.esponenti || []),
];
const scheduleCR =
  scheduleReportData?.data?.["CR"];
const schedule05Years =
  Object.keys(schedule05).sort((a, b) => b - a);
  
console.log("SCHEDULE05", schedule05);
console.log("YEARS", schedule05Years);

 return (
  <div
    style={{
      padding: "24px",
      background: "#f8fafc",
      minHeight: "100vh",
    }}
  >
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  }}
>
  <h1
    style={{
      fontSize: "30px",
      fontWeight: "700",
      margin: 0,
      color: "#0f172a",
      letterSpacing: "0.3px",
    }}
  >
    {company?.denominazione || "Company"} - {company?.company_name || "Italy Financial Report Dashboard"}
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


{schedules.includes("05") && (
  <div
    style={{
      marginTop: "20px",
      background: "#ffffff",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
      border: "1px solid #e5e7eb",
    }}
  >
    <h2
      style={{
        padding: "18px 22px",
        margin: 0,
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#ffffff",
        fontSize: "20px",
        fontWeight: "700",
      }}
    >
      Company Overview
    </h2>

    <div style={{ overflowX: "auto" }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th style={thStyle}>Year</th>
        <th style={thStyle}>Revenue</th>
        <th style={thStyle}>Profit</th>
        <th style={thStyle}>Employee Cost</th>
        <th style={thStyle}>Employees</th>
      </tr>
    </thead>

    <tbody>
      {schedule05Years.map((year) => (
        <tr key={year}>
          <td style={tdStyle}>{year}</td>

          <td style={tdStyle}>
            {schedule05[year]?.fatturato?.toLocaleString() || "-"}
          </td>

          <td style={tdStyle}>
            {schedule05[year]?.utile?.toLocaleString() || "-"}
          </td>

          <td style={tdStyle}>
            {schedule05[year]?.costo_personale?.toLocaleString() || "-"}
          </td>

          <td style={tdStyle}>
            {schedule05[year]?.numero_dipendenti ?? "-"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  </div>
)}
{schedules.includes("50") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Profitability Analysis
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Metric</th>

          {profitabilityYears.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[
          ["Profit", profitabilityData.profit],
          [
            "Employee Cost",
            profitabilityData.employeeCost,
          ],
          [
            "Number of Employees",
            profitabilityData.employees,
          ],
        ].map(([label, values]) => (
          <tr key={label}>
            <td style={tdStyle}>
              <strong>{label}</strong>
            </td>

            {profitabilityYears.map((year) => (
              <td key={year} style={tdStyle}>
                {values?.[year] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}
{schedules.includes("85") && (
  <div
    style={{
      marginTop: "20px",
      background: "#ffffff",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
      border: "1px solid #e5e7eb",
    }}
  >
    <h2
      style={{
        padding: "18px 22px",
        margin: 0,
        background:
          "linear-gradient(90deg, #7c3aed, #8b5cf6)",
        color: "#ffffff",
        fontSize: "20px",
        fontWeight: "700",
      }}
    >
      Contacts, Shareholders, Executives & CEO
    </h2>

    <div style={{ padding: "20px" }}>
      <h3
  style={{
    marginTop: "20px",
    marginBottom: "0",
    padding: "14px 18px",
    background:
      "linear-gradient(90deg, #1e3a8a, #2563eb)",
    color: "#ffffff",
    borderRadius: "8px 8px 0 0",
    fontSize: "18px",
    fontWeight: "700",
  }}
>
  Contacts
</h3>
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr>
      <th style={thStyle}>Phone</th>
      <th style={thStyle}>Email</th>
      <th style={thStyle}>PEC</th>
      <th style={thStyle}>Website</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={tdStyle}>
        {contacts?.telefoni?.join(", ") || "-"}
      </td>

      <td style={tdStyle}>
        {contacts?.email?.join(", ") || "-"}
      </td>

      <td style={tdStyle}>
        {contacts?.pec?.join(", ") || "-"}
      </td>

      <td style={tdStyle}>
        {contacts?.siti_web?.join(", ") || "-"}
      </td>
    </tr>
  </tbody>
</table>
<h3
  style={{
    marginTop: "30px",
    marginBottom: "0",
    padding: "14px 18px",
    background:
      "linear-gradient(90deg, #1e3a8a, #2563eb)",
    color: "#ffffff",
    borderRadius: "8px 8px 0 0",
    fontSize: "18px",
    fontWeight: "700",
  }}
>
  Management Team
</h3>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr>
      <th style={thStyle}>Name</th>
      <th style={thStyle}>Role</th>
      <th style={thStyle}>Tax Code</th>
    </tr>
  </thead>

  <tbody>
    {managementTeam.map((person, index) => (
      <tr key={index}>
        <td style={tdStyle}>
          {person.denominazione}
        </td>

        <td style={tdStyle}>
          {person.carica}
        </td>

        <td style={tdStyle}>
          {person.cf}
        </td>
      </tr>
    ))}
  </tbody>
</table>
<h3
  style={{
    marginTop: "30px",
    marginBottom: "0",
    padding: "14px 18px",
    background:
      "linear-gradient(90deg, #1e3a8a, #2563eb)",
    color: "#ffffff",
    borderRadius: "8px 8px 0 0",
    fontSize: "18px",
    fontWeight: "700",
  }}
>
  Shareholders
</h3>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr>
      <th style={thStyle}>Shareholder</th>
      <th style={thStyle}>Ownership %</th>
      <th style={thStyle}>Nominal Value</th>
      <th style={thStyle}>Paid Value</th>
    </tr>
  </thead>

  <tbody>
    {shareholders.map((shareholder, index) => (
      <tr key={index}>
        <td style={tdStyle}>
          {shareholder.denominazione}
        </td>

        <td style={tdStyle}>
          {shareholder.quota_perc_cons}%
        </td>

        <td style={tdStyle}>
          {shareholder.valore_nominale?.toLocaleString()}
        </td>

        <td style={tdStyle}>
          {shareholder.valore_versato?.toLocaleString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  </div>
)}
   {schedules.includes("10") && (
<div
  style={{
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5e7eb",
  }}
>
      <h2
        style={{
          padding: "18px 22px",
          margin: 0,
          background:
            "linear-gradient(90deg, #1e3a8a, #2563eb)",
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: "700",
          letterSpacing: "0.3px",
        }}
      >
        Income Statement (Conto Economico) - EUR (€)
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "900px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...thStyle,
                  width: "280px",
                }}
              >
                Financial Item
              </th>

             {schedule10Years.map((year) => (
  <th key={year} style={thStyle}>
    {year}
  </th>
))}
            </tr>
          </thead>

         <tbody>
  <tr>
    <td style={tdStyle}>Operating Revenue</td>
    {renderYearData(
      incomeData.operatingRevenue,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Other Revenue</td>
    {renderYearData(
      incomeData.otherRevenue,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Production Value</td>
    {renderYearData(
      incomeData.totalProductionValue,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Production Cost</td>
    {renderYearData(
      incomeData.totalProductionCost,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Purchase Cost</td>
    {renderYearData(
      incomeData.purchaseCost,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Service Cost</td>
    {renderYearData(
      incomeData.serviceCost,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Third-party Asset Cost</td>
    {renderYearData(
      incomeData.thirdPartyAssetCost,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Employee Cost</td>
    {renderYearData(
      incomeData.employeeCost,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Other Operating Expenses</td>
    {renderYearData(
      incomeData.otherOperatingExpenses,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>EBITDA</td>
    {renderYearData(
      incomeData.ebitda,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Depreciation & Amortization
    </td>
    {renderYearData(
      incomeData.depreciation,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>EBIT</td>
    {renderYearData(
      incomeData.ebit,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Financial Income / Charges
    </td>
    {renderYearData(
      incomeData.financialCharges,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Profit Before Tax</td>
    {renderYearData(
      incomeData.profitBeforeTax,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Tax</td>
    {renderYearData(
      incomeData.tax,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Net Profit / Loss</td>
    {renderYearData(
      incomeData.netProfit,
      schedule10Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Cash Flow</td>
    {renderYearData(
      incomeData.cashFlow,
      schedule10Years
    )}
  </tr>
</tbody>
        </table>
      </div>
   </div>
)}

{schedules.includes("20") && (
<div
  style={{
    marginTop: "30px",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5e7eb",
  }}
>
  <h2
    style={{
      padding: "18px 22px",
      margin: 0,
      background:
        "linear-gradient(90deg, #1e3a8a, #2563eb)",
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
    }}
  >
    Balance Sheet Assets • EUR (€)
  </h2>

  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "900px",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              ...thStyle,
              width: "280px",
            }}
          >
            Financial Item
          </th>

      {schedule20Years.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
  <tr>
    <td style={tdStyle}>Intangible Assets</td>
    {renderYearData(
      assetsTableData.intangibleAssets,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Tangible Assets</td>
    {renderYearData(
      assetsTableData.tangibleAssets,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Fixed Assets</td>
    {renderYearData(
      assetsTableData.totalFixedAssets,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Receivables</td>
    {renderYearData(
      assetsTableData.totalReceivables,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Receivables within 12 Months
    </td>
    {renderYearData(
      assetsTableData.receivables12Months,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Cash & Cash Equivalents
    </td>
    {renderYearData(
      assetsTableData.cashEquivalents,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Current Assets</td>
    {renderYearData(
      assetsTableData.currentAssets,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Accrued Assets</td>
    {renderYearData(
      assetsTableData.accruedAssets,
      schedule20Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Assets</td>
    {renderYearData(
      assetsTableData.totalAssets,
      schedule20Years
    )}
  </tr>
</tbody>
    </table>
  </div>
</div>
)}



  {schedules.includes("40") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Financial Ratios & Indicators
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Indicator</th>

          {ratioYears.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[
          ["ROE (%)", ratioData.roe],
          ["ROI (%)", ratioData.roi],
          ["ROS (%)", ratioData.ros],
          ["Current Ratio", ratioData.currentRatio],
          ["Quick Ratio", ratioData.quickRatio],
          [
            "Net Financial Position",
            ratioData.netFinancialPosition,
          ],
          [
            "Revenue Growth (%)",
            ratioData.revenueGrowth,
          ],
          [
            "Production Value Growth (%)",
            ratioData.productionGrowth,
          ],
          [
            "Net Worth Growth (%)",
            ratioData.netWorthGrowth,
          ],
          [
            "Total Assets Growth (%)",
            ratioData.assetsGrowth,
          ],
        ].map(([label, values]) => (
          <tr key={label}>
            <td style={tdStyle}>
              <strong>{label}</strong>
            </td>

            {ratioYears.map((year) => (
              <td key={year} style={tdStyle}>
                {values?.[year] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

{schedules.includes("60") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Productivity Analysis
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Metric</th>

          {productivityYears.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[
          ["Revenue", productivityData.revenue],
          [
            "Employee Cost",
            productivityData.employeeCost,
          ],
          [
            "Number of Employees",
            productivityData.employees,
          ],
        ].map(([label, values]) => (
          <tr key={label}>
            <td style={tdStyle}>
              <strong>{label}</strong>
            </td>

            {productivityYears.map((year) => (
              <td key={year} style={tdStyle}>
                {values?.[year] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}  
{schedules.includes("70") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Growth Analysis
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Metric</th>

          {growthYears.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[
          ["Profit", growthData.profit],
          ["Revenue", growthData.revenue],
          [
            "Employee Cost",
            growthData.employeeCost,
          ],
          [
            "Number of Employees",
            growthData.employees,
          ],
        ].map(([label, values]) => (
          <tr key={label}>
            <td style={tdStyle}>
              <strong>{label}</strong>
            </td>

            {growthYears.map((year) => (
              <td key={year} style={tdStyle}>
                {values?.[year] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}
{schedules.includes("ANA") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Company Registry Information
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={thStyle}>Company Name</td>
          <td style={tdStyle}>
            {scheduleANA.ragione_sociale || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Tax Code</td>
          <td style={tdStyle}>
            {scheduleANA.codice_fiscale || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>VAT Number</td>
          <td style={tdStyle}>
            {scheduleANA.partita_iva || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Legal Form</td>
          <td style={tdStyle}>
            {scheduleANA.forma_giuridica?.descrizione ||
              "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>ATECO Code</td>
          <td style={tdStyle}>
            {scheduleANA.ateco?.codice || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>ATECO Description</td>
          <td style={tdStyle}>
            {scheduleANA.ateco?.descrizione || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Registered Office</td>
          <td style={tdStyle}>
            {scheduleANA.sede_legale || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Registration Date</td>
          <td style={tdStyle}>
            {scheduleANA.data_iscrizione || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Business Start Date</td>
          <td style={tdStyle}>
            {scheduleANA.inizio_attivita || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Share Capital</td>
          <td style={tdStyle}>
            {scheduleANA.capitale_sociale || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Phone</td>
          <td style={tdStyle}>
            {scheduleANA.telefono || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Email</td>
          <td style={tdStyle}>
            {scheduleANA.email || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>PEC</td>
          <td style={tdStyle}>
            {scheduleANA.pec || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>SDI</td>
          <td style={tdStyle}>
            {scheduleANA.sdi || "-"}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}
{schedules.includes("PROT") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Protests & Negative Records
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={thStyle}>Protests</td>
          <td style={tdStyle}>
            {schedulePROT.protesti || "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Negative Records</td>
          <td style={tdStyle}>
            {schedulePROT.pregiudizievoli || "-"}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}
{schedules.includes("CR") && (
  <>
    <h2
      style={{
        marginTop: "30px",
        marginBottom: "0",
        padding: "14px 18px",
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
      }}
    >
      Credit Score & Rating
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={thStyle}>Credit Score</td>
          <td style={tdStyle}>
            {scheduleCR?.credit_score ?? "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Rating</td>
          <td style={tdStyle}>
            {scheduleCR?.rating ?? "-"}
          </td>
        </tr>

        <tr>
          <td style={thStyle}>Credit Line</td>
          <td style={tdStyle}>
            {scheduleCR?.linea_credito_affidamento?.toLocaleString() ?? "-"}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}
{schedules.includes("30") && (
<div
  style={{
    marginTop: "30px",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5e7eb",
  }}
>
  <h2
    style={{
      padding: "18px 22px",
      margin: 0,
      background:
        "linear-gradient(90deg, #1e3a8a, #2563eb)",
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "700",
    }}
  >
    Balance Sheet Liabilities • EUR (€)
  </h2>

  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "900px",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              ...thStyle,
              width: "280px",
            }}
          >
            Financial Item
          </th>

          {schedule30Years.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
  <tr>
    <td style={tdStyle}>Equity / Net Worth</td>
    {renderYearData(
      liabilitiesTableData.netWorth,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Share Capital</td>
    {renderYearData(
      liabilitiesTableData.shareCapital,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Reserves</td>
    {renderYearData(
      liabilitiesTableData.reserves,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Retained Earnings / Profit
    </td>
    {renderYearData(
      liabilitiesTableData.retainedEarnings,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Provisions</td>
    {renderYearData(
      liabilitiesTableData.provisions,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Employee Severance Fund
    </td>
    {renderYearData(
      liabilitiesTableData.employeeSeveranceFund,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Payables</td>
    {renderYearData(
      liabilitiesTableData.totalPayables,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Payables within 12 Months
    </td>
    {renderYearData(
      liabilitiesTableData.payables12Months,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>
      Accrued Liabilities
    </td>
    {renderYearData(
      liabilitiesTableData.accruedLiabilities,
      schedule30Years
    )}
  </tr>

  <tr>
    <td style={tdStyle}>Total Liabilities</td>
    {renderYearData(
      liabilitiesTableData.totalLiabilities,
      schedule30Years
    )}
  </tr>
</tbody>
    </table>
  </div>
</div>
)}
  
  
        </div>
);
};
 


 
export default ItalyReportsPage;