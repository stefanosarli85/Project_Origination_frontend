import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

const ItalyReportsPage = () => {
  const location = useLocation();

  const companyCodes = useMemo(
    () => location.state?.companyCodes || [],
    [location.state?.companyCodes]
  );

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
  const renderYearData = (obj) =>
  years.map((year) => (
    <td key={year} style={tdStyle}>
      {obj?.[year] != null
        ? Number(obj[year]).toLocaleString("en-US")
        : "-"}
    </td>
  ));
    const incomeStatement =
  reportData?.data?.related_data?.italy_company_balance_sheet || [];
const years = [...new Set(
  incomeStatement.map((item) => String(item.financial_year))
)].sort((a, b) => a - b);
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

incomeStatement.forEach((item) => {
  const year = item.financial_year;

  incomeData.operatingRevenue[year] = item.ricavi_operativi;
  incomeData.otherRevenue[year] = item.ricavi_e_proventi;
  incomeData.totalProductionValue[year] =
    item.totale_valore_produzione;
  incomeData.totalProductionCost[year] =
    item.totale_costi_produzione;
  incomeData.purchaseCost[year] =
    item.costo_per_acquisti;
  incomeData.serviceCost[year] =
    item.costo_per_servizi;
  incomeData.thirdPartyAssetCost[year] =
    item.costo_per_godimento_beni_terzi;
  incomeData.employeeCost[year] =
    item.costo_personale;
  incomeData.otherOperatingExpenses[year] =
    item.oneri_diversi_gestione;
  incomeData.ebitda[year] =
    item.ebitda;
  incomeData.depreciation[year] =
    item.ammortamenti_svalutazioni;
  incomeData.ebit[year] =
    item.ebit;
  incomeData.financialCharges[year] =
    item.proventi_oneri_finanziari;
  incomeData.profitBeforeTax[year] =
    item.risultato_prima_imposte;
  incomeData.tax[year] =
    item.imposte_reddito;
  incomeData.netProfit[year] =
    item.utile_perdita_esercizio;
  incomeData.cashFlow[year] =
    item.flusso_di_cassa;
});
const assetsData =
  reportData?.data?.related_data?.italy_company_assets || [];

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

assetsData.forEach((item) => {
  const year = item.financial_year;

  assetsTableData.intangibleAssets[year] =
    item.immobilizzazioni_immateriali;

  assetsTableData.tangibleAssets[year] =
    item.immobilizzazioni_materiali;

  assetsTableData.totalFixedAssets[year] =
    item.totale_immobilizzazioni;

  assetsTableData.totalReceivables[year] =
    item.totale_crediti;

  assetsTableData.receivables12Months[year] =
    item.crediti_entro_12_mesi;

  assetsTableData.cashEquivalents[year] =
    item.totale_disponibilita_liquide;

  assetsTableData.currentAssets[year] =
    item.totale_attivo_circolante;

  assetsTableData.accruedAssets[year] =
    item.ratei_risconti_attivi;

  assetsTableData.totalAssets[year] =
    item.totale_attivo;
});
const liabilitiesData =
  reportData?.data?.related_data?.italy_company_liabilities || [];

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

liabilitiesData.forEach((item) => {
  const year = item.financial_year;

  liabilitiesTableData.netWorth[year] =
    item.patrimonio_netto;

  liabilitiesTableData.shareCapital[year] =
    item.capitale_sociale;

  liabilitiesTableData.reserves[year] =
    item.riserve;

  liabilitiesTableData.retainedEarnings[year] =
    item.utile_perdita_portato;

  liabilitiesTableData.provisions[year] =
    item.fondi_rischi_oneri;

  liabilitiesTableData.employeeSeveranceFund[year] =
    item.trattamento_fine_rapporto;

  liabilitiesTableData.totalPayables[year] =
    item.totale_debiti;

  liabilitiesTableData.payables12Months[year] =
    item.debiti_entro_12_mesi;

  liabilitiesTableData.accruedLiabilities[year] =
    item.ratei_risconti_passivi;

  liabilitiesTableData.totalLiabilities[year] =
    item.totale_passivo;
});


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

              {years.map((year) => (
                <th key={year} style={thStyle}>
                  {year}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={tdStyle}>Operating Revenue</td>
              {renderYearData(incomeData.operatingRevenue)}
            </tr>

            <tr>
              <td style={tdStyle}>Other Revenue</td>
              {renderYearData(incomeData.otherRevenue)}
            </tr>

            <tr>
              <td style={tdStyle}>Total Production Value</td>
              {renderYearData(
                incomeData.totalProductionValue
              )}
            </tr>

            <tr>
              <td style={tdStyle}>Total Production Cost</td>
              {renderYearData(
                incomeData.totalProductionCost
              )}
            </tr>

            <tr>
              <td style={tdStyle}>Purchase Cost</td>
              {renderYearData(incomeData.purchaseCost)}
            </tr>

            <tr>
              <td style={tdStyle}>Service Cost</td>
              {renderYearData(incomeData.serviceCost)}
            </tr>

            <tr>
              <td style={tdStyle}>
                Third-party Asset Cost
              </td>
              {renderYearData(
                incomeData.thirdPartyAssetCost
              )}
            </tr>

            <tr>
              <td style={tdStyle}>Employee Cost</td>
              {renderYearData(incomeData.employeeCost)}
            </tr>

            <tr>
              <td style={tdStyle}>
                Other Operating Expenses
              </td>
              {renderYearData(
                incomeData.otherOperatingExpenses
              )}
            </tr>

            <tr>
              <td style={tdStyle}>EBITDA</td>
              {renderYearData(incomeData.ebitda)}
            </tr>

            <tr>
              <td style={tdStyle}>
                Depreciation & Amortization
              </td>
              {renderYearData(incomeData.depreciation)}
            </tr>

            <tr>
              <td style={tdStyle}>EBIT</td>
              {renderYearData(incomeData.ebit)}
            </tr>

            <tr>
              <td style={tdStyle}>
                Financial Income / Charges
              </td>
              {renderYearData(
                incomeData.financialCharges
              )}
            </tr>

            <tr>
              <td style={tdStyle}>Profit Before Tax</td>
              {renderYearData(
                incomeData.profitBeforeTax
              )}
            </tr>

            <tr>
              <td style={tdStyle}>Tax</td>
              {renderYearData(incomeData.tax)}
            </tr>

            <tr>
              <td style={tdStyle}>Net Profit / Loss</td>
              {renderYearData(incomeData.netProfit)}
            </tr>

            <tr>
              <td style={tdStyle}>Cash Flow</td>
              {renderYearData(incomeData.cashFlow)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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

          {years.map((year) => (
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
            assetsTableData.intangibleAssets
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Tangible Assets</td>
          {renderYearData(
            assetsTableData.tangibleAssets
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Total Fixed Assets</td>
          {renderYearData(
            assetsTableData.totalFixedAssets
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Total Receivables</td>
          {renderYearData(
            assetsTableData.totalReceivables
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Receivables within 12 Months
          </td>
          {renderYearData(
            assetsTableData.receivables12Months
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Cash & Cash Equivalents
          </td>
          {renderYearData(
            assetsTableData.cashEquivalents
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Current Assets</td>
          {renderYearData(
            assetsTableData.currentAssets
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Accrued Assets</td>
          {renderYearData(
            assetsTableData.accruedAssets
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Total Assets</td>
          {renderYearData(
            assetsTableData.totalAssets
          )}
        </tr>
      </tbody>
    </table>
  </div>
</div>
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

          {years.map((year) => (
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
            liabilitiesTableData.netWorth
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Share Capital</td>
          {renderYearData(
            liabilitiesTableData.shareCapital
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Reserves</td>
          {renderYearData(
            liabilitiesTableData.reserves
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Retained Earnings / Profit
          </td>
          {renderYearData(
            liabilitiesTableData.retainedEarnings
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Provisions</td>
          {renderYearData(
            liabilitiesTableData.provisions
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Employee Severance Fund
          </td>
          {renderYearData(
            liabilitiesTableData.employeeSeveranceFund
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Total Payables</td>
          {renderYearData(
            liabilitiesTableData.totalPayables
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Payables within 12 Months
          </td>
          {renderYearData(
            liabilitiesTableData.payables12Months
          )}
        </tr>

        <tr>
          <td style={tdStyle}>
            Accrued Liabilities
          </td>
          {renderYearData(
            liabilitiesTableData.accruedLiabilities
          )}
        </tr>

        <tr>
          <td style={tdStyle}>Total Liabilities</td>
          {renderYearData(
            liabilitiesTableData.totalLiabilities
          )}
        </tr>
      </tbody>
    </table>
  </div>
</div>
  </div>
 );


 
};

export default ItalyReportsPage;