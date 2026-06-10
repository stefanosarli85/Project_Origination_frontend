import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
 
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
 
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import FactoryIcon from "@mui/icons-material/Factory";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
 
// ─── Field group definitions ────────────────────────────────────────────────
const FIELD_GROUPS = [
  {
    label: "Company Info",
    icon: <BusinessIcon fontSize="small" />,
    accent: "#1565c0",
    bg: "#e3f2fd",
    keys: [
      "denominazione", "codice_fiscale", "partita_iva",
      "forma_giuridica", "natura_giuridica", "stato_attivita",
    ],
  },
  {
    label: "Location",
    icon: <LocationOnIcon fontSize="small" />,
    accent: "#2e7d32",
    bg: "#e8f5e9",
    keys: [
      "indirizzo", "comune", "provincia", "cap",
      "regione", "nazione", "latitudine", "longitudine",
    ],
  },
  {
  label: "Industry",
  icon: <FactoryIcon fontSize="small" />,
  accent: "#e65100",
  bg: "#fff3e0",
  keys: [
    "codice_ateco",
    "main_industry",
    "sub_industry",
    "descrizione_ateco",
    "codice_ateco_secondario",
    "attivita_prevalente",
  ],
},
 
  {
    label: "Registry & Legal",
    icon: <AccountBalanceIcon fontSize="small" />,
    accent: "#b71c1c",
    bg: "#ffebee",
    keys: [
      "codice_cciaa", "rea",
      "data_costituzione", "data_iscrizione_ri", "data_cancellazione",
    ],
  },
  {
    label: "Contact",
    icon: <EmailIcon fontSize="small" />,
    accent: "#01579b",
    bg: "#e1f5fe",
    keys: ["pec", "sdi", "email", "telefono", "sito_web"],
  },
];
 
const KEY_METRICS = [
  {
    key: "ricavi_operativi_2024",
    label: "Revenue 2024",
    icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    color: "#1565c0",
    bg: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
    prefix: "€",
  },
  {
    key: "ebit_2024",
    label: "EBIT 2024",
    icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
    color: "#2e7d32",
    bg: "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",
    prefix: "€",
  },
  {
    key: "numero_dipendenti_2024",
    label: "Employees 2024",
    icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    color: "#e65100",
    bg: "linear-gradient(135deg, #e65100 0%, #fb8c00 100%)",
    prefix: "",
  },
];
 
const HEADER_KEYS = new Set(["denominazione", "codice_fiscale", "comune", "provincia"]);
const ALL_GROUPED_KEYS = new Set(
  FIELD_GROUPS.flatMap((g) => g.keys).concat(KEY_METRICS.map((m) => m.key))
);
 
const fmtKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
 
const fmtValue = (val) => {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return val.toLocaleString("en-US");
  return String(val);
};
 
// ─── Section card ────────────────────────────────────────────────────────────
const SectionCard = ({ group, data }) => {
  const entries = group.keys
    .map((k) => [k, fmtValue(data[k])])
    .filter(([, v]) => v !== null);
 
  if (entries.length === 0) return null;
 
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderLeft: `4px solid ${group.accent}`,
        borderRadius: "8px",
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          background: group.bg,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ color: group.accent, display: "flex" }}>{group.icon}</Box>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: group.accent, textTransform: "uppercase", letterSpacing: 1 }}
        >
          {group.label}
        </Typography>
      </Box>
 
      {/* Fields */}
      <Box sx={{ p: 0 }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <tbody>
      {entries.map(([key, value]) => (
        <tr key={key}>
          <td
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e0e0e0",
              borderRight: "1px solid #d0d0d0",
              fontWeight: 600,
              width: "40%",
              background: "#fafafa",
            }}
          >
            {fmtKey(key)}
          </td>
 
          <td
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Box>
     
    </Box>
  );
};
 
// ─── Main component ──────────────────────────────────────────────────────────
const ItalyTable = () => {
  const navigate = useNavigate();
 
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  const [scheduleDialogOpen, setScheduleDialogOpen] =
  useState(false);
 
const [selectedSchedules, setSelectedSchedules] =
  useState([]);
  const SCHEDULES = [
  { code: "05", label: "Company Overview" },
  { code: "10", label: "Financial Statement (Income Statement)" },
  { code: "20", label: "Assets Balance Sheet" },
  { code: "30", label: "Liabilities Balance Sheet" },
  { code: "40", label: "Financial Ratios & Indicators" },
  { code: "50", label: "Profitability Analysis" },
  { code: "60", label: "Productivity Analysis" },
  { code: "70", label: "Growth Analysis" },
  {
    code: "85",
    label: "Contacts, Shareholders, Executives & CEO",
  },
  {
    code: "ANA",
    label: "Company Registry Information",
  },
  {
    code: "PROT",
    label: "Protests & Negative Records",
  },
  {
    code: "CR",
    label: "Credit Score & Rating",
  },
];
 
  const shareholders =
  reportData?.data?.related_data?.italy_company_shareholders || [];
 
 
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [rowCount, setRowCount] = useState(0);

const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 100,
});
 useEffect(() => {
  const savedState = sessionStorage.getItem("italyTableState");

  if (savedState) {
    const state = JSON.parse(savedState);

    setPagination({
      pageIndex: state.pageIndex || 0,
      pageSize: state.pageSize || 100,
    });

    setColumnFilters(state.filters || []);
    setSorting(state.sorting || []);
  }
}, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
 
        const params = new URLSearchParams();
        let hasFilters = false;
 
        columnFilters.forEach((filter) => {
          const value = filter.value?.toString().trim();
          if (!value) return;
          hasFilters = true;
 
          if (filter.id === "codice_fiscale") params.append("company_code", value);
          if (filter.id === "denominazione") params.append("company_name", value);
          if (filter.id === "comune") params.append("city", value);
          if (filter.id === "codice_ateco") params.append("industry_code", value);
          if (filter.id === "main_industry")
  params.append("main_industry", value);

if (filter.id === "sub_industry")
  params.append("sub_industry", value);
 
          if (filter.id === "ricavi_operativi_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
              params.append("revenue_min", min.trim());
              params.append("revenue_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append("revenue_min", value.replace(">", "").trim());
            } else if (value.startsWith("<")) {
              params.append("revenue_max", value.replace("<", "").trim());
            } else {
              params.append("revenue_min", value);
            }
          }
 
          if (filter.id === "ebit_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
              params.append("ebit_min", min.trim());
              params.append("ebit_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append("ebit_min", value.replace(">", "").trim());
            } else if (value.startsWith("<")) {
              params.append("ebit_max", value.replace("<", "").trim());
            } else {
              params.append("ebit_min", value);
            }
          }
 
          if (filter.id === "numero_dipendenti_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
              params.append("employees_min", min.trim());
              params.append("employees_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append("employees_min", value.replace(">", "").trim());
            } else if (value.startsWith("<")) {
              params.append("employees_max", value.replace("<", "").trim());
            } else {
              params.append("employees_min", value.trim());
              params.append("employees_max", value.trim());
            }
          }
        });
        if (sorting.length > 0) {
          console.log("SORTING OBJECT", sorting);
console.log("SORT COLUMN", sorting[0]?.id);
  const sortColumn = sorting[0].id;

  const sortMap = {
    ricavi_operativi_2024: "revenue",
    ebit_2024: "ebit",
    numero_dipendenti_2024: "employees",
    denominazione: "company_name",
    comune: "city",
    codice_fiscale: "id",
  };

  params.append(
    "sort_by",
    sortMap[sortColumn] || "id"
  );

  params.append(
    "sort_order",
    sorting[0].desc ? "desc" : "asc"
  );
  
}
params.append(
  "page",
  String(pagination.pageIndex + 1)
);

params.append(
  "limit",
  String(pagination.pageSize)
);
 
        const hasSorting = sorting.length > 0;

const url =
  hasFilters || hasSorting
    ? `http://43.205.207.160:1701/api/italy-search-columns?${params.toString()}`
    : `http://43.205.207.160:1701/api/italy-get-all-records?page=1`;
        console.log("API URL:", url);
 
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
 
        const json = await response.json();
        console.log("TOTAL:", json.total);
console.log("FIRST COMPANY:", json.data?.[0]?.denominazione);
console.log("FIRST REVENUE:", json.data?.[0]?.ricavi_operativi_2024);
        console.log("API RESPONSE:", json);
        console.log("TOTAL RECORDS RECEIVED:", json.data?.length);
console.log("FIRST RECORD:", json.data?.[0]);

        

        

 setData(json.data || []);
setRowCount(json.total || 0);
setIsError(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchData();
}, [columnFilters, sorting, pagination]);
 
  const columns = useMemo(
    () => [
      { accessorKey: "codice_fiscale", header: "Company Code" },
      { accessorKey: "denominazione", header: "Company Name" },
      { accessorKey: "comune", header: "City" },
      { accessorKey: "codice_ateco", header: "Industry Code" },
      { accessorKey: "main_industry", header: "Main Industry" },
      { accessorKey: "sub_industry", header: "Sub Industry" },
      {
        accessorKey: "ricavi_operativi_2024",
        header: "Revenue 2024",
        Cell: ({ cell }) => Number(cell.getValue()).toLocaleString("en-US"),
      },
      {
        accessorKey: "ebit_2024",
        header: "EBIT 2024",
        Cell: ({ cell }) => Number(cell.getValue()).toLocaleString("en-US"),
      },
      {
        accessorKey: "numero_dipendenti_2024",
        header: "Employees 2024",
        Cell: ({ cell }) => Number(cell.getValue()).toLocaleString("en-US"),
      },
    ],
    []
  );
 
  const handleRowSelection = (rowId) => setRowSelection({ [rowId]: true });
 
  const handleInfoClick = async (row) => {
  try {
    const companyCode =
      row.original.codice_fiscale;
     
 
    const response = await fetch(
      `http://43.205.207.160:1701/api/italy/company/${companyCode}`
    );
 
    const data = await response.json();
    console.log(
  "BALANCE SHEET",
  data?.data?.related_data?.italy_company_balance_sheet
);

console.log(
  "ASSETS",
  data?.data?.related_data?.italy_company_assets
);

console.log(
  "LIABILITIES",
  data?.data?.related_data?.italy_company_liabilities
);
    console.log("ACTION RESPONSE", data);
 
    setSelectedRowData(row.original);

if (data?.success === true) {
  setReportData(data);
} else {
  setReportData({
    success: false,
    searchData: row.original,
  });
}

setModalOpen(true);
  } catch (error) {
    console.error(error);
  }
};
 const handleFetchReports = () => {
  const selectedRow =
    table.getSelectedRowModel().rows[0];
 const searchData = selectedRow.original;
  if (!selectedRow) return;
 
  setScheduleDialogOpen(true);
};
const handleScheduleToggle = (code) => {
  setSelectedSchedules((prev) =>
    prev.includes(code)
      ? prev.filter((item) => item !== code)
      : [...prev, code]
  );
};
const handleGenerateReport = async () => {
  try {
    const selectedRow =
      table.getSelectedRowModel().rows[0];
 
    if (!selectedRow) return;
 
    const companyCode =
      selectedRow.original.codice_fiscale;
     
    const params = new URLSearchParams();
 
    selectedSchedules.forEach((schedule) => {
      params.append("schedules", schedule);
    });
    const searchData = selectedRow.original;
 
 
    const response = await fetch(
      `${BASE_URL}/api/italy/company/${companyCode}?${params.toString()}`,
      {
        method: "POST",
      }
    );
 
    const data = await response.json();
 
    console.log("REPORT RESPONSE", data);
    console.log(
  "Selected Schedules Before Navigate:",
  selectedSchedules
);
sessionStorage.setItem("currentStep", "2");
sessionStorage.setItem("currentRegion", "Italy");
navigate("/italy-reports", {
  state: {
    companyCodes: [companyCode],
    schedules: selectedSchedules,
    reportData: {
      ...data,
      searchData,
    },
  },
});
    setScheduleDialogOpen(false);
  } catch (error) {
    console.error(error);
  }
};
const [isDownloading, setIsDownloading] = useState(false);
const [isFetchingNews, setIsFetchingNews] =
  useState(false);
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: false,
    enableRowActions: true,
    positionActionsColumn: "last",
    manualFiltering: true,
    manualPagination: true,
onPaginationChange: setPagination,
rowCount,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
manualSorting: true,
    getRowId: (row) => row.codice_fiscale,
 state: {
  rowSelection,
  isLoading,
  showAlertBanner: isError,
  columnFilters,
  sorting,
  pagination,
},
    muiSelectCheckboxProps: ({ row }) => ({
      checked: !!rowSelection[row.id],
      onChange: () => handleRowSelection(row.id),
    }),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      showColumnFilters: true,
      showGlobalFilter: false,
    },
    renderRowActions: ({ row }) => (
      <IconButton
        size="small"
        title="View full details"
        onClick={() => handleInfoClick(row)}
        sx={{ color: "#1976d2" }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    ),
    renderTopToolbarCustomActions: () => (
  <div
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    <button
      onClick={handleFetchReports}
      disabled={
        table.getSelectedRowModel().rows.length === 0
      }
      style={{
        padding: "10px 16px",
        background: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Fetch Financial Reports
    </button>
 <button
  onClick={() => {
    sessionStorage.removeItem("currentStep");
    sessionStorage.removeItem("currentRegion");
    window.location.href = "/search-companies";
  }}
  style={{
    padding: "10px 16px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ← Back to Landing Page
</button>
    <button
      onClick={handleDownload}
      disabled={
        table.getSelectedRowModel().rows.length === 0 ||
        isDownloading
      }
      style={{
        padding: "10px 16px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {isDownloading
        ? "Downloading..."
        : "Download Report"}
    </button>
    <button
  onClick={handleFetchNews}
  disabled={
    table.getSelectedRowModel().rows.length === 0 ||
    isFetchingNews
  }
  style={{
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  {isFetchingNews
    ? "Fetching News..."
    : "Fetch News"}
</button>
  </div>
),
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,
  });
  const BASE_URL = "http://43.205.207.160:1701";
 
const handleDownload = async () => {
  try {
    setIsDownloading(true);
 
    const selectedRow =
      table.getSelectedRowModel().rows[0];
 
    if (!selectedRow) {
      alert("Please select a company");
      return;
    }
 
    const companyCode =
      selectedRow.original.codice_fiscale;
 
    const response = await fetch(
      `${BASE_URL}/api/fetch-financial-document/${companyCode}`,
      {
        method: "POST",
      }
    );
 
    const data = await response.json();
 
    const fileUrl = data?.s3_url;
 
    if (!fileUrl) {
      throw new Error("No file URL found");
    }
 
    window.open(fileUrl, "_blank");
  } catch (error) {
    console.error(error);
    alert("Failed to download report");
  } finally {
    setIsDownloading(false);
  }
};

const handleFetchNews = async () => {
  try {
    setIsFetchingNews(true);

    const selectedRow =
      table.getSelectedRowModel().rows[0];

    if (!selectedRow) {
      alert("Please select a company");
      return;
    }

    const companyName =
      selectedRow.original.denominazione;

    const response = await fetch(
      `${BASE_URL}/api/fetch-news?company_name=${encodeURIComponent(
        companyName
      )}`
    );

    const newsData = await response.json();

console.log("NEWS RESPONSE", newsData);
console.log("FIRST ARTICLE", newsData.articles?.[0]);

sessionStorage.setItem(
  "italyTableState",
  JSON.stringify({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filters: columnFilters,
    sorting: sorting,
  })
);

navigate("/company-news", {
  state: newsData,
});
  } catch (error) {
    console.error(error);
    alert("Failed to fetch news");
  } finally {
    setIsFetchingNews(false);
  }
};
 
  // Leftover fields not covered by any group
  const otherEntries = selectedRowData
    ? Object.entries(selectedRowData).filter(
        ([k, v]) => !ALL_GROUPED_KEYS.has(k) && !HEADER_KEYS.has(k) && fmtValue(v) !== null
      )
    : [];
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
  const people =
  reportData?.data?.related_data?.italy_company_people || [];
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
  console.log("ASSET ROW", item);
console.log(
  "DISPONIBILITA LIQUIDE",
  item.disponibilita_liquide
);
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
    item.disponibilita_liquide;
 
  assetsTableData.currentAssets[year] =
    item.attivo_circolante;
 
  assetsTableData.accruedAssets[year] =
    item.ratei_risconti_attivi;
 
  assetsTableData.totalAssets[year] =
    item.totale_attivo;
});
const searchData = reportData?.searchData;
console.log("SEARCH DATA KEYS", Object.keys(searchData || {}));

const isSearchData =
  reportData?.success === false &&
  reportData?.searchData;

if (isSearchData) {
  assetsTableData.intangibleAssets = {
    2022: searchData?.immobilizzazioni_immateriali_2022,
    2023: searchData?.immobilizzazioni_immateriali_2023,
    2024: searchData?.immobilizzazioni_immateriali_2024,
  };

  assetsTableData.tangibleAssets = {
    2022: searchData?.immobilizzazioni_materiali_2022,
    2023: searchData?.immobilizzazioni_materiali_2023,
    2024: searchData?.immobilizzazioni_materiali_2024,
  };

  assetsTableData.totalReceivables = {
    2022: searchData?.crediti_verso_clienti_2022,
    2023: searchData?.crediti_verso_clienti_2023,
    2024: searchData?.crediti_verso_clienti_2024,
  };

  assetsTableData.cashEquivalents = {
    2022: searchData?.disponibilita_liquide_2022,
    2023: searchData?.disponibilita_liquide_2023,
    2024: searchData?.disponibilita_liquide_2024,
  };
  console.log(
  "CASH EQUIVALENTS MAPPING",
  assetsTableData.cashEquivalents
);

  console.log(
  "LIQUIDE VALUES",
  searchData?.disponibilita_liquide_2022,
  searchData?.disponibilita_liquide_2023,
  searchData?.disponibilita_liquide_2024
);
}

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
  payablesBeyond12Months: {},
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
    item.utile_perdita_portato_a_nuovo;
 
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
if (isSearchData) {
 liabilitiesTableData.netWorth = {
    2022: searchData?.equity_net_worth_2022,
    2023: searchData?.equity_net_worth_2023,
    2024: searchData?.equity_net_worth_2024,
  };

  liabilitiesTableData.shareCapital = {
    2022: searchData?.share_capital_2022,
    2023: searchData?.share_capital_2023,
    2024: searchData?.share_capital_2024,
  };

  liabilitiesTableData.reserves = {
    2022: searchData?.reserves_2022,
    2023: searchData?.reserves_2023,
    2024: searchData?.reserves_2024,
  };
liabilitiesTableData.retainedEarnings = {
    2022: searchData?.retained_earnings_profit_2022,
    2023: searchData?.retained_earnings_profit_2023,
    2024: searchData?.retained_earnings_profit_2024,
  };

  liabilitiesTableData.provisions = {
    2022: searchData?.provisions_2022,
    2023: searchData?.provisions_2023,
    2024: searchData?.provisions_2024,
  };

  liabilitiesTableData.employeeSeveranceFund = {
    2022: searchData?.trattamento_fine_rapporto_2022,
    2023: searchData?.trattamento_fine_rapporto_2023,
    2024: searchData?.trattamento_fine_rapporto_2024,
  };

  liabilitiesTableData.totalPayables = {
    2022: searchData?.totale_debiti_2022,
    2023: searchData?.totale_debiti_2023,
    2024: searchData?.totale_debiti_2024,
  };

  liabilitiesTableData.payables12Months = {
    2022: searchData?.debiti_entro_12_mesi_2022,
    2023: searchData?.debiti_entro_12_mesi_2023,
    2024: searchData?.debiti_entro_12_mesi_2024,
  };
  liabilitiesTableData.payablesBeyond12Months = {
  2022: searchData?.debiti_oltre_12_mesi_2022,
  2023: searchData?.debiti_oltre_12_mesi_2023,
  2024: searchData?.debiti_oltre_12_mesi_2024,
};

  liabilitiesTableData.accruedLiabilities = {
    2022: searchData?.accrued_liabilities_2022,
    2023: searchData?.accrued_liabilities_2023,
    2024: searchData?.accrued_liabilities_2024,
  };

  liabilitiesTableData.totalLiabilities = {
    2022: searchData?.total_liabilities_2022,
    2023: searchData?.total_liabilities_2023,
    2024: searchData?.total_liabilities_2024,
  };
  console.log(
  "NET WORTH",
  searchData?.equity_net_worth_2022
);

console.log(
  "SHARE CAPITAL",
  searchData?.share_capital_2022
);

console.log(
  "TOTAL LIABILITIES",
  searchData?.total_liabilities_2022
);
}
    const incomeStatement =
  reportData?.data?.related_data?.italy_company_balance_sheet || [];
 
  console.log(
  "BALANCE SHEET",
  reportData?.data?.related_data?.italy_company_balance_sheet
);

const years =
  incomeStatement.length > 0
    ? [...new Set(
        incomeStatement.map((item) =>
          String(item.financial_year)
        )
      )].sort((a, b) => a - b)
    : ["2022", "2023", "2024"];
   
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

  incomeData.operatingRevenue[year] =
    item.ricavi_operativi;

  incomeData.otherRevenue[year] =
    item.ricavi_e_proventi;

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

if (isSearchData) {
  incomeData.operatingRevenue = {
    2022: searchData?.ricavi_operativi_2022,
    2023: searchData?.ricavi_operativi_2023,
    2024: searchData?.ricavi_operativi_2024,
  };

  incomeData.totalProductionValue = {
    2022: searchData?.totale_valore_produzione_2022,
    2023: searchData?.totale_valore_produzione_2023,
    2024: searchData?.totale_valore_produzione_2024,
  };

  incomeData.totalProductionCost = {
    2022: searchData?.totale_costi_produzione_2022,
    2023: searchData?.totale_costi_produzione_2023,
    2024: searchData?.totale_costi_produzione_2024,
  };

  incomeData.employeeCost = {
    2022: searchData?.costo_personale_2022,
    2023: searchData?.costo_personale_2023,
    2024: searchData?.costo_personale_2024,
  };
  incomeData.depreciation = {
  2022: searchData?.ammortamenti_e_svalutazioni_2022,
  2023: searchData?.ammortamenti_e_svalutazioni_2023,
  2024: searchData?.ammortamenti_e_svalutazioni_2024,
};

  incomeData.ebit = {
    2022: searchData?.ebit_2022,
    2023: searchData?.ebit_2023,
    2024: searchData?.ebit_2024,
  };
  incomeData.otherRevenue = {
  2022: searchData?.other_revenue_2022,
  2023: searchData?.other_revenue_2023,
  2024: searchData?.other_revenue_2024,
};

incomeData.purchaseCost = {
  2022: searchData?.purchase_cost_2022,
  2023: searchData?.purchase_cost_2023,
  2024: searchData?.purchase_cost_2024,
};

incomeData.serviceCost = {
  2022: searchData?.service_cost_2022,
  2023: searchData?.service_cost_2023,
  2024: searchData?.service_cost_2024,
};

incomeData.thirdPartyAssetCost = {
  2022: searchData?.third_party_asset_cost_2022,
  2023: searchData?.third_party_asset_cost_2023,
  2024: searchData?.third_party_asset_cost_2024,
};

incomeData.ebitda = {
  2022: searchData?.ebitda_2022,
  2023: searchData?.ebitda_2023,
  2024: searchData?.ebitda_2024,
};

incomeData.financialCharges = {
  2022: searchData?.financial_charges_2022,
  2023: searchData?.financial_charges_2023,
  2024: searchData?.financial_charges_2024,
};

incomeData.profitBeforeTax = {
  2022: searchData?.profit_before_tax_2022,
  2023: searchData?.profit_before_tax_2023,
  2024: searchData?.profit_before_tax_2024,
};

incomeData.tax = {
  2022: searchData?.tax_2022,
  2023: searchData?.tax_2023,
  2024: searchData?.tax_2024,
};

incomeData.netProfit = {
  2022: searchData?.net_profit_2022,
  2023: searchData?.net_profit_2023,
  2024: searchData?.net_profit_2024,
};

incomeData.cashFlow = {
  2022: searchData?.cash_flow_2022,
  2023: searchData?.cash_flow_2023,
  2024: searchData?.cash_flow_2024,
};
  

  console.log("IS SEARCH DATA", isSearchData);
  console.log("SEARCH DATA", searchData);

  
}
  return (
    <>
      <MaterialReactTable table={table} />
 
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        {/* ── Gradient header ── */}
        {selectedRowData && (
          <Box
            sx={{
              background: "linear-gradient(135deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)",
              px: 3,
              pt: 3,
              pb: 2.5,
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setModalOpen(false)}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "rgba(255,255,255,0.8)",
                "&:hover": { color: "#fff", background: "rgba(255,255,255,0.15)" },
              }}
            >
              <CloseIcon />
            </IconButton>
 
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: "#fff", pr: 4, lineHeight: 1.3, mb: 0.5 }}
            >
              {selectedRowData.denominazione || "Company Details"}
            </Typography>
 
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {selectedRowData.codice_fiscale && (
                <Chip
                  label={selectedRowData.codice_fiscale}
                  size="small"
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
              {(selectedRowData.comune || selectedRowData.provincia) && (
                <Chip
                  icon={<LocationOnIcon sx={{ color: "#fff !important", fontSize: 14 }} />}
                  label={[selectedRowData.comune, selectedRowData.provincia].filter(Boolean).join(", ")}
                  size="small"
                  sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.75rem" }}
                />
              )}
              {selectedRowData.stato_attivita && (
                <Chip
                  label={selectedRowData.stato_attivita}
                  size="small"
                  sx={{
                    background: "rgba(76,175,80,0.35)",
                    color: "#c8e6c9",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Box>
          </Box>
        )}
 
 
        {/* ── Key metrics strip ── */}
        {selectedRowData && (
          <Box
            sx={{
              display: "flex",
              gap: 0,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {KEY_METRICS.map((m, i) => {
              const raw = selectedRowData[m.key];
              const val = fmtValue(raw);
              return (
                <Box
                  key={m.key}
                  sx={{
                    flex: 1,
                    px: 2.5,
                    py: 1.75,
                    textAlign: "center",
                    borderRight: i < KEY_METRICS.length - 1 ? "1px solid #e0e0e0" : "none",
                    background: "#fafafa",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      fontSize: "0.62rem",
                    }}
                  >
                    {m.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: m.color, mt: 0.25, fontSize: "1.1rem" }}
                  >
                    {val !== null ? `${m.prefix}${val}` : "—"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
       
 
        {/* ── Scrollable sections ── */}
        <DialogContent
          sx={{
            p: 2.5,
            maxHeight: "55vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { background: "#bdbdbd", borderRadius: 3 },
          }}
        >
          {selectedRowData &&
            FIELD_GROUPS.map((group) => (
              <SectionCard key={group.label} group={group} data={selectedRowData} />
            ))}
 
          {/* Overflow / ungrouped fields */}
         
 
          {people.length > 0 && (
  <Box
  sx={{
    border: "1px solid #e0e0e0",
    borderLeft: "4px solid #1565c0",
    borderRadius: "8px",
    overflow: "hidden",
    mb: 2,
    mt: 2,
  }}
>
    <Box
      sx={{
        px: 2,
        py: 1,
        background: "#1976d2",
      }}
    >
     <Typography
  variant="caption"
  fontWeight={700}
  sx={{
   color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  }}
>
        Management Team
      </Typography>
    </Box>
 
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Full Name</th>
          <th style={thStyle}>Role</th>
          <th style={thStyle}>Category</th>
        </tr>
      </thead>
 
      <tbody>-
        {people.map((person, index) => (
          <tr key={index}>
            <td style={tdStyle}>
              {person.full_name}
            </td>
 
            <td style={tdStyle}>
              {person.role_name}
            </td>
 
            <td style={tdStyle}>
              {person.category}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
)}
 
{shareholders.length > 0 && (
  <Box
  sx={{
    mt: 3,
    border: "1px solid #e0e0e0",
    borderLeft: "4px solid #1565c0",
    borderRadius: "8px",
    overflow: "hidden",
  }}
>
    <Box
      sx={{
        px: 2,
        py: 1,
        background: "#1976d2",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
        }}
      >
        Shareholders
      </Typography>
    </Box>
 
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Shareholder Name</th>
          <th style={thStyle}>Ownership %</th>
          <th style={thStyle}>Nominal Value</th>
        </tr>
      </thead>
 
      <tbody>
        {shareholders.map((item, index) => (
          <tr key={index}>
            <td style={tdStyle}>
              {item.shareholder_name || "-"}
            </td>
 
            <td style={tdStyle}>
              {item.ownership_percentage || "-"}
            </td>
 
            <td style={tdStyle}>
              {item.nominal_value
                ? Number(item.nominal_value).toLocaleString("en-US")
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
)}
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
          marginTop: "20px",
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
    Payables beyond 12 Months
  </td>
  {renderYearData(
    liabilitiesTableData.payablesBeyond12Months
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
   <Box
  sx={{
    border: "1px solid #e0e0e0",
    borderLeft: "4px solid #1565c0",
    borderRadius: "8px",
    overflow: "hidden",
    mb: 2,
  }}
>
  <Box
    sx={{
      px: 2,
      py: 1,
      background: "#e3f2fd",
    }}
  >
    <Typography
      variant="caption"
      fontWeight={700}
      sx={{
        color: "#1565c0",
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      PFN (Net Financial Position)
    </Typography>
  </Box>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th style={thStyle}>Financial Item</th>
        <th style={thStyle}>2022</th>
        <th style={thStyle}>2023</th>
        <th style={thStyle}>2024</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td style={tdStyle}>PFN</td>
        <td style={tdStyle}>
          {Number(selectedRowData?.pfn_2022 || 0).toLocaleString("en-US")}
        </td>
        <td style={tdStyle}>
          {Number(selectedRowData?.pfn_2023 || 0).toLocaleString("en-US")}
        </td>
        <td style={tdStyle}>
          {Number(selectedRowData?.pfn_2024 || 0).toLocaleString("en-US")}
        </td>
      </tr>
    </tbody>
  </table>
</Box>

 
 
        </DialogContent>
      </Dialog>
      <Dialog
  open={scheduleDialogOpen}
  onClose={() => setScheduleDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <Box
    sx={{
      background:
        "linear-gradient(135deg,#0f172a,#1e3a8a)",
      color: "#fff",
      p: 3,
    }}
  >
    <Typography variant="h5" fontWeight={700}>
      Generate Custom Financial Report
    </Typography>
 
    <Typography sx={{ mt: 1, opacity: 0.9 }}>
      Select the schedules you would like
      to include in the report.
    </Typography>
  </Box>
 
  <DialogContent sx={{ p: 3 }}>
    {SCHEDULES.map((item) => (
      <Box
        key={item.code}
        onClick={() =>
          handleScheduleToggle(item.code)
        }
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          mb: 1.5,
          borderRadius: 2,
          cursor: "pointer",
          border: selectedSchedules.includes(
            item.code
          )
            ? "2px solid #2563eb"
            : "1px solid #e5e7eb",
          background:
            selectedSchedules.includes(item.code)
              ? "#eff6ff"
              : "#ffffff",
          transition: "0.2s",
        }}
      >
        <Chip
          label={item.code}
          sx={{
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
          }}
        />
 
        <Typography>
          {item.label}
        </Typography>
      </Box>
    ))}
 
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography fontWeight={600}>
        {selectedSchedules.length}
        {" "}Schedule(s) Selected
      </Typography>
 
      <Box>
        <button
          onClick={() =>
            setScheduleDialogOpen(false)
          }
          style={{
            padding: "10px 18px",
            marginRight: "10px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
 
        <button
          onClick={handleGenerateReport}
          disabled={
            selectedSchedules.length === 0
          }
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Generate Report
        </button>
      </Box>
    </Box>
  </DialogContent>
</Dialog>
    </>
   
  );
};
 
 
export default ItalyTable;
 
 