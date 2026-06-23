import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { Skeleton } from "@mui/material";
import creditLogo from "../../assets/credit-logo.png";
import walletLogo from "../../assets/wallet-logo.jpg";
 
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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
    label: "",
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
    display: group.label ? "flex" : "none",
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
  const [scheduleStatus, setScheduleStatus] =
  useState({});
  const [availableSchedules, setAvailableSchedules] =
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
    label: "ANA Company Registry Information",
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
  fetchCredit();
  fetchWallet();
}, []);
const handleWalletClick = async () => {
  try {
    const response = await fetch(
      "https://backend.formula-cf-ai.com/api/wallet/transactions"
    );

    const data = await response.json();

    setWalletTransactions(data.data || []);
    setWalletDialogOpen(true);
  } catch (error) {
    console.error(error);
  }
};
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
    ? `https://backend.formula-cf-ai.com/api/italy-search-columns?${params.toString()}`
    : `https://backend.formula-cf-ai.com/api/italy-get-all-records?page=1`;
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
 
  // const handleRowSelection = (rowId) => setRowSelection({ [rowId]: true });
 
const handleInfoClick = async (row) => {
  try {
    const companyCode =
      row.original.codice_fiscale;
      console.log("SELECTED ROW", selectedRowData);

    // Get schedule status
    const statusResponse = await fetch(
      `https://backend.formula-cf-ai.com/api/get-schedule-status/${companyCode}`
    );

    const statusData =
      await statusResponse.json();

    const schedules = Object.keys(
      statusData[companyCode] || {}
    )
      .filter(
        (key) =>
          statusData[companyCode][key] === true
      )
      .map((key) =>
        key.startsWith("S")
          ? key.replace("S", "")
          : key
      );

    console.log(
      "TRUE SCHEDULES",
      schedules
    );

    setAvailableSchedules(schedules);

    const params = new URLSearchParams();

    schedules.forEach((schedule) => {
      params.append("schedules", schedule);
    });

    const response = await fetch(
      `https://backend.formula-cf-ai.com/api/italy/company/${companyCode}?${params.toString()}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
console.log(
  "ACTION RESPONSE FULL",
  JSON.stringify(data, null, 2)
);
    console.log("RELATED DATA", data?.data?.related_data);
console.log("RELATED DATA KEYS",
  Object.keys(data?.data?.related_data || {})
);

    setSelectedRowData(row.original);
    console.log("EXCEL DATA", row.original);

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
const handleFetchReports = async () => {
  const selectedRow =
    table.getSelectedRowModel().rows[0];

  if (!selectedRow) return;

  try {
    const companyCode =
      selectedRow.original.codice_fiscale;

    const response = await fetch(
      `https://backend.formula-cf-ai.com/api/get-schedule-status/${companyCode}`
    );

    const data = await response.json();

    console.log("SCHEDULE STATUS", data);

    const statusData =
      data[companyCode] || {};

    setScheduleStatus(statusData);

    const trueSchedules = Object.keys(
      statusData
    )
      .filter(
        (key) => statusData[key] === true
      )
      .map((key) =>
        key.startsWith("S")
          ? key.replace("S", "")
          : key
      );

    console.log(
      "AVAILABLE SCHEDULES",
      trueSchedules
    );

    setAvailableSchedules(
      trueSchedules
    );

    setScheduleDialogOpen(true);
  } catch (error) {
    console.error(error);
    setScheduleDialogOpen(true);
  }
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
const [isReportAvailable, setIsReportAvailable] = useState(null);
const [isFetchingNews, setIsFetchingNews] =
  useState(false);
  const [creditData, setCreditData] = useState(null);
const [walletData, setWalletData] = useState(null);
const [walletTransactions, setWalletTransactions] = useState([]);
const [walletDialogOpen, setWalletDialogOpen] = useState(false);
 useEffect(() => {
  const selectedRow =
    table?.getSelectedRowModel()?.rows?.[0];

  if (!selectedRow) {
    setIsReportAvailable(null);
    return;
  }

  const companyCode =
    selectedRow.original.codice_fiscale;

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/isDocumentAvailable/${companyCode}`
      );

      const data = await response.json();

      console.log("STATUS API", data);

      setIsReportAvailable(
        data.isReportAvailable
      );
    } catch (error) {
      console.error(error);
    }
  };

  checkStatus();
}, [rowSelection]);
const handleExportCSV = () => {
  const selectedRows =
    table.getSelectedRowModel().rows;

  if (selectedRows.length === 0) {
    alert("Please select at least one company");
    return;
  }

  const csvData = selectedRows.map((row) => ({
    "Company Code": row.original.codice_fiscale,
    "Company Name": row.original.denominazione,
    City: row.original.comune,
    "Industry Code": row.original.codice_ateco,
    "Main Industry": row.original.main_industry,
    Revenue: row.original.ricavi_operativi_2024,
    EBIT: row.original.ebit_2024,
    Employees: row.original.numero_dipendenti_2024,
  }));

  const headers = Object.keys(csvData[0]);

  const csvRows = [
    headers.join(","),
    ...csvData.map((row) =>
      headers
        .map((field) => `"${row[field] ?? ""}"`)
        .join(",")
    ),
  ];

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Companies.csv";
  link.click();

  URL.revokeObjectURL(url);
};



  const table = useMaterialReactTable({
  columns,
  data,

  muiTopToolbarProps: {
    sx: {
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backgroundColor: "#fff",
    },
  },

  muiTableContainerProps: {
    sx: {
      maxHeight: "75vh",
    },
  },

  enableStickyHeader: true,

  enableRowSelection: true,

    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
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
    // muiSelectCheckboxProps: ({ row }) => ({
    //   checked: !!rowSelection[row.id],
    //   onChange: () => handleRowSelection(row.id),
    // }),
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
      position: "sticky",
      top: "0",
      zIndex: 1000,
      background: "#fff",
      padding: "10px",
      borderBottom: "1px solid #e5e7eb",
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
    {table.getSelectedRowModel().rows.length > 0 && (
  <button
  onClick={handleExportCSV}
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
    Export Excel
  </button>
)}
 
   {table.getSelectedRowModel().rows.length > 0 &&
 isReportAvailable !== null && (
<button
  onClick={handleDownload}
  disabled={isDownloading}
  style={{
    padding: "10px 16px",
    background:
      isReportAvailable === true
        ? "#16a34a"
        : "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  {isDownloading
    ? "Downloading..."
    : isReportAvailable === true
    ? "Fetch Report"
    : "Download Report"}
</button>
)}
    {table.getSelectedRowModel().rows.length > 0 && (
  <button
    onClick={handleFetchNews}
    disabled={isFetchingNews}
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
)}
  </div>
),
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,
  });
  const BASE_URL = "http://43.205.207.160:1701";
  const fetchCredit = async () => {
  try {
    const response = await fetch(
      "https://backend.formula-cf-ai.com/api/reportaziende/credit"
    );

    const data = await response.json();

    console.log("CREDIT API", data);

    setCreditData(data);
  } catch (error) {
    console.error(error);
  }
};

const fetchWallet = async () => {
  try {
    const response = await fetch(
      "https://backend.formula-cf-ai.com/api/wallet"
    );

    const data = await response.json();

    console.log("WALLET API", data);

    setWalletData(data);
  } catch (error) {
    console.error(error);
  }
};
 
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

    console.log("DOWNLOAD RESPONSE", data);

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
  Object.entries(reportData?.data?.["20"] || {});
  const schedule05 =
  reportData?.data?.["05"] || {};
const schedule40 =
  reportData?.data?.["40"] || {};
  const schedule50 =
  reportData?.data?.["50"] || {};
  const schedule60 =
  reportData?.data?.["60"] || {};
  const schedule70 = reportData?.data?.["70"] || {};

const schedule70Years = Object.keys(
  schedule70
).sort((a, b) => Number(b) - Number(a));

const schedule60Years = Object.keys(
  schedule60
).sort((a, b) => Number(b) - Number(a));

const schedule50Years = Object.keys(
  schedule50
).sort((a, b) => Number(b) - Number(a));

const schedule40Years = Object.keys(
  schedule40
).sort((a, b) => Number(b) - Number(a));
const schedule05Years = Object.keys(
  schedule05
).sort((a, b) => Number(b) - Number(a));
  console.log(
  "ASSETS RAW",
  reportData?.data?.["20"]
);

console.log(
  "ASSETS DATA",
  assetsData
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
assetsData.forEach(([year, item]) => {

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
  Object.entries(reportData?.data?.["30"] || {});
 
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
liabilitiesData.forEach(([year, item]) => {
  liabilitiesTableData.netWorth[year] =
  item.patrimonio_netto;

liabilitiesTableData.shareCapital[year] =
  item.capitale_sociale;

liabilitiesTableData.reserves[year] =
  item.altre_riserve;

liabilitiesTableData.retainedEarnings[year] =
  item.utile_perdita_esercizio;

liabilitiesTableData.employeeSeveranceFund[year] =
  item.fondo_tfr;

liabilitiesTableData.totalPayables[year] =
  item.totale_debiti;

liabilitiesTableData.payables12Months[year] =
  item.debiti_entro_12_mesi;

liabilitiesTableData.payablesBeyond12Months[year] =
  item.debiti_oltre_12_mesi;

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
  Object.entries(reportData?.data?.["10"] || {});
 
  console.log(
  "BALANCE SHEET",
  reportData?.data?.related_data?.italy_company_balance_sheet
);
const years = Object.keys(
  reportData?.data?.["10"] || {}
);
console.log("YEARS", years);
   
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
 
incomeStatement.forEach(([year, item]) => {

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
const transposeData = (data) => {
  const years = Object.keys(data);

  const result = [];

  const firstYear = years[0];

  Object.keys(data[firstYear] || {}).forEach((itemKey) => {
    const row = {
      "Financial Item": itemKey,
    };

    years.forEach((year) => {
      row[year] = data[year]?.[itemKey] ?? "";
    });

    result.push(row);
  });

  return result;
};
const handleExportDialogExcel = () => {
  const workbook = XLSX.utils.book_new();

  // Company Details
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([selectedRowData]),
    "Company Details"
  );

  // Management Team
  if (people.length > 0) {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(people),
      "85 Contacts, Shareholders, Executives & CEO"
    );
  }

  // Shareholders
  if (shareholders.length > 0) {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(shareholders),
      "85 Contacts, Shareholders, Executives & CEO"
    );
  }
if (Object.keys(schedule05).length) {
  const data = transposeData(schedule05);

  const years = Object.keys(schedule05).sort(
  (a, b) => Number(b) - Number(a)
);

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "05 Company Overview"
  );
}
if (incomeStatement?.length) {
  const data = transposeData(
    Object.fromEntries(incomeStatement)
  );

  const years = incomeStatement
    .map(([year]) => year)
    .sort((a, b) => Number(b) - Number(a));

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "10 Financial Statement"
  );
}
if (assetsData?.length) {
  const data = transposeData(
    Object.fromEntries(assetsData)
  );

  const years = assetsData
    .map(([year]) => year)
    .sort((a, b) => Number(b) - Number(a));

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "20 Assets"
  );
}
if (liabilitiesData?.length) {
  const data = transposeData(
    Object.fromEntries(liabilitiesData)
  );

  const years = liabilitiesData
    .map(([year]) => year)
    .sort((a, b) => Number(b) - Number(a));

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "30 Liabilities"
  );
}
if (shareholders?.length) {
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(shareholders),
    "85 Shareholders"
  );
}
if (reportData?.data?.ANA) {
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        Phone: reportData.data.ANA.telefono,
        Email: reportData.data.ANA.email,
        PEC: reportData.data.ANA.pec,
      },
    ]),
    "85 Contacts"
  );
}
if (Object.keys(schedule40).length) {
  const data = transposeData(schedule40);

  const years = Object.keys(schedule40).sort(
    (a, b) => Number(b) - Number(a)
  );

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "40 Financial Ratios"
  );
}
if (Object.keys(schedule50).length) {
  const data = transposeData(schedule50);

  const years = Object.keys(schedule50).sort(
    (a, b) => Number(b) - Number(a)
  );

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "50 Profitability"
  );
}

if (Object.keys(schedule60).length) {
  const data = transposeData(schedule60);

  const years = Object.keys(schedule60).sort(
    (a, b) => Number(b) - Number(a)
  );

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "60 Productivity"
  );
}

if (Object.keys(schedule70).length) {
  const data = transposeData(schedule70);

  const years = Object.keys(schedule70).sort(
    (a, b) => Number(b) - Number(a)
  );

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: ["Financial Item", ...years],
  });

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "70 Growth"
  );
}

if (reportData?.data?.ANA) {
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([reportData.data.ANA]),
    "ANA"
  );
}

if (reportData?.data?.PROT) {
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([reportData.data.PROT]),
    "PROT"
  );
}


if (reportData?.data?.CR) {
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([reportData.data.CR]),
    "CR"
  );
}
  XLSX.writeFile(
    workbook,
    `${selectedRowData?.denominazione || "Company"}.xlsx`
  );
};
  return (
    <>
   <button
  onClick={() => {
    sessionStorage.removeItem("currentStep");
   <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
    mb: 2,
    mt: 2,
  }}
>
  {/* Credit Card */}
  
</Box>
    sessionStorage.removeItem("currentRegion");
    window.location.assign("/search-companies");
  }}
  style={{
    background: "transparent",
    color: "#1976d2",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    padding: "0",
    marginBottom: "12px",
  }}
>
  ← Back to Landing Page
</button>
<Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 3,
    mb: 2,
    mr: 2,
  }}
>
 <Box
  sx={{
    width: 260,
    height: 95,
    bgcolor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    px: 2,
    position: "relative",
    overflow: "hidden",
    borderLeft: "4px solid #6D4AFF",
  }}
>
<Box
  sx={{
    width: 110,
    height: 40,
    mr: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
 <img
  src={creditLogo}
  alt="Reportaziende"
  style={{
    width: "140px",
    height: "auto",
    objectFit: "contain",
  }}
/>
</Box>

  <Box>
    <Typography
      sx={{
        fontSize: "12px",
        color: "#9CA3AF",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      Available Credit
    </Typography>

    <Typography
      sx={{
        fontSize: "42px",
        fontWeight: 700,
        color: "#1F2937",
        lineHeight: 1.1,
      }}
    >
      {creditData?.available_credit ?? 0}
    </Typography>
  </Box>
</Box>

  <Box
  onClick={handleWalletClick}
  sx={{
    width: 260,
    height: 95,
    bgcolor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    px: 2,
    cursor: "pointer",
    overflow: "hidden",
    borderLeft: "4px solid #F59E0B",

    "&:hover": {
      transform: "translateY(-2px)",
      transition: "0.3s",
      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    },
  }}
>
<Box
  sx={{
    width: 56,
    height: 56,
    borderRadius: "14px",
    bgcolor: "#fff7ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
  }}
>
  <img
  src={walletLogo}
  alt="OpenAPI"
  style={{
    width: "70px",
    height: "auto",
    objectFit: "contain",
  }}
/>
</Box>

  <Box>
    <Typography
      sx={{
        fontSize: "12px",
        color: "#9CA3AF",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
       Wallet Balance
    </Typography>

    <Typography
      sx={{
        fontSize: "42px",
        fontWeight: 700,
        color: "#1F2937",
        lineHeight: 1.1,
      }}
    >
     {walletData?.data?.credit !== undefined ? (
  `€ ${walletData.data.credit}`
) : (
  <Skeleton
    variant="text"
    width={80}
    height={40}
    sx={{ borderRadius: 1 }}
  />
)}
    </Typography>
  </Box>
</Box>
</Box>
      <MaterialReactTable table={table} />
      <Dialog
  open={walletDialogOpen}
  onClose={() => setWalletDialogOpen(false)}
  maxWidth="lg"
  fullWidth
>
  <DialogContent>
    <Typography
      variant="h6"
      sx={{ mb: 2 }}
    >
      Wallet Transactions
    </Typography>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Amount</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Date</th>
        </tr>
      </thead>

      <tbody>
        {walletTransactions.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>
              {item.amount}
            </td>

            <td style={tdStyle}>
              {item.description}
            </td>

            <td style={tdStyle}>
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </DialogContent>
</Dialog>
 
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
  }}
>
  <CloseIcon />
</IconButton>

<button
  onClick={handleExportDialogExcel}
  style={{
    position: "absolute",
    top: "12px",
    right: "60px",
    padding: "10px 16px",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 10,
  }}
>
  📊 Export Excel
</button>
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
          
          {availableSchedules.includes("05") && (
  <>
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
      05 Company Overview
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
            <th style={thStyle}>Financial Item</th>

            {schedule05Years.map((year) => (
              <th key={year} style={thStyle}>
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle}>Revenue</td>

            {schedule05Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule05[year]?.fatturato || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Net Profit</td>

            {schedule05Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule05[year]?.utile || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employee Cost</td>

            {schedule05Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule05[year]?.costo_personale || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employees</td>

            {schedule05Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule05[year]?.numero_dipendenti || "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </>
)}

{availableSchedules.includes("PROT") && (
  <>
    <h2
      style={{
        padding: "18px 22px",
        margin: 0,
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
      }}
    >
      PROT Protests & Negative Records
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={tdStyle}>Protests</td>
          <td style={tdStyle}>
            {reportData?.data?.PROT?.protesti || "-"}
          </td>
        </tr>

        <tr>
          <td style={tdStyle}>Negative Records</td>
          <td style={tdStyle}>
            {reportData?.data?.PROT?.pregiudizievoli || "-"}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}
{availableSchedules.includes("70") && (
  <>
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
      70 Growth Analysis
    </h2>

    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={thStyle}>Indicator</th>
          {schedule70Years.map((year) => (
            <th key={year} style={thStyle}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style={tdStyle}>Revenue</td>
          {schedule70Years.map((year) => (
            <td key={year} style={tdStyle}>
              {Number(
                schedule70[year]?.fatturato || 0
              ).toLocaleString("en-US")}
            </td>
          ))}
        </tr>

        <tr>
          <td style={tdStyle}>Net Profit</td>
          {schedule70Years.map((year) => (
            <td key={year} style={tdStyle}>
              {Number(
                schedule70[year]?.utile || 0
              ).toLocaleString("en-US")}
            </td>
          ))}
        </tr>

        <tr>
          <td style={tdStyle}>Employee Cost</td>
          {schedule70Years.map((year) => (
            <td key={year} style={tdStyle}>
              {Number(
                schedule70[year]?.costo_personale || 0
              ).toLocaleString("en-US")}
            </td>
          ))}
        </tr>

        <tr>
          <td style={tdStyle}>Employees</td>
          {schedule70Years.map((year) => (
            <td key={year} style={tdStyle}>
              {schedule70[year]?.dipendenti || "-"}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </>
)}
{availableSchedules.includes("CR") && (
  <>
    <h2
      style={{
        padding: "18px 22px",
        margin: 0,
        background:
          "linear-gradient(90deg, #1e3a8a, #2563eb)",
        color: "#fff",
      }}
    >
      CR Credit Score & Rating
    </h2>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={tdStyle}>Rating</td>
          <td style={tdStyle}>
            {reportData?.data?.CR?.rating || "-"}
          </td>
        </tr>

        <tr>
          <td style={tdStyle}>Credit Score</td>
          <td style={tdStyle}>
            {reportData?.data?.CR?.credit_score || "-"}
          </td>
        </tr>

        <tr>
          <td style={tdStyle}>Credit Line</td>
          <td style={tdStyle}>
            {Number(
              reportData?.data?.CR?.linea_credito_affidamento || 0
            ).toLocaleString("en-US")}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}

{availableSchedules.includes("40") && (
  <>
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
      40 Financial Ratios & Indicators
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
            <th style={thStyle}>Indicator</th>

            {schedule40Years.map((year) => (
              <th key={year} style={thStyle}>
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle}>ROE (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_roe ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>ROI (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_roi ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>ROS (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_ros ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Current Ratio</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.indice_disponibilita ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Quick Ratio</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.indice_liquidita_immediata ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Net Financial Position</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule40[year]?.pfn || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Revenue Growth (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_variazione_ricavi ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Production Growth (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_variazione_valore_produzione ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Net Worth Growth (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_variazione_patrimonio_netto ?? "-"}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Assets Growth (%)</td>

            {schedule40Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule40[year]?.perc_variazione_attivo ?? "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </>
)}
{availableSchedules.includes("50") && (
  <>
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
      50 Profitability Analysis
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
            <th style={thStyle}>Indicator</th>

            {schedule50Years.map((year) => (
              <th key={year} style={thStyle}>
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle}>Net Profit</td>

            {schedule50Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule50[year]?.utile || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employee Cost</td>

            {schedule50Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule50[year]?.costo_personale || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employees</td>

            {schedule50Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule50[year]?.dipendenti ?? "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </>
)}
         
{availableSchedules.includes("ANA") && (
  <>
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
      ANA Company Registry Information
    </h2>

    {selectedRowData &&
      FIELD_GROUPS.map((group) => (
        <SectionCard
          key={group.label}
          group={group}
          data={selectedRowData}
        />
      ))}
  </>
)}
          {/* Overflow / ungrouped fields */}
         
 {availableSchedules.includes("85") &&
  people.length > 0 && (
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
 
      <tbody>
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
{availableSchedules.includes("60") && (
  <>
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
      60 Productivity Analysis
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
            <th style={thStyle}>Indicator</th>

            {schedule60Years.map((year) => (
              <th key={year} style={thStyle}>
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tdStyle}>Revenue</td>

            {schedule60Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule60[year]?.fatturato || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employee Cost</td>

            {schedule60Years.map((year) => (
              <td key={year} style={tdStyle}>
                {Number(
                  schedule60[year]?.costo_personale || 0
                ).toLocaleString("en-US")}
              </td>
            ))}
          </tr>

          <tr>
            <td style={tdStyle}>Employees</td>

            {schedule60Years.map((year) => (
              <td key={year} style={tdStyle}>
                {schedule60[year]?.dipendenti ?? "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </>
)}
{availableSchedules.includes("85") &&
  shareholders.length > 0 && (
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
{availableSchedules.includes("10") && (
  <>
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
        10 Financial Statement (Income Statement)
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
 </>
)}
{availableSchedules.includes("20") && (
  <>
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
20 Assets Balance Sheet
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
   </>
  
)}
{availableSchedules.includes("85") && (
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
        sx={{
          color: "#fff",
          fontWeight: 700,
        }}
      >
        Contacts
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
          <th style={thStyle}>Phone</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>PEC</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style={tdStyle}>
            {reportData?.data?.ANA?.telefono || "-"}
          </td>

          <td style={tdStyle}>
            {reportData?.data?.ANA?.email || "-"}
          </td>

          <td style={tdStyle}>
            {reportData?.data?.ANA?.pec || "-"}
          </td>
        </tr>
      </tbody>
    </table>
  </Box>
)}
{availableSchedules.includes("30") && (
  <>
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
     30 Liabilities Balance Sheet
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
  </>
)}

 <Box
  sx={{
    border: "1px solid #dbeafe",
    borderRadius: "0 0 8px 8px",
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
<h2
  style={{
    padding: "18px 22px",
    margin: 0,
    background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
    color: "#fff",
  }}
>
  10 Financial Statement
</h2>

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
      <td style={tdStyle}>Operating Revenue</td>
      <td style={tdStyle}>{Number(selectedRowData?.ricavi_operativi_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ricavi_operativi_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ricavi_operativi_2024 || 0).toLocaleString()}</td>
    </tr>

    <tr>
      <td style={tdStyle}>Total Production Value</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_valore_produzione_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_valore_produzione_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_valore_produzione_2024 || 0).toLocaleString()}</td>
    </tr>

    <tr>
      <td style={tdStyle}>Total Production Cost</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_costi_produzione_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_costi_produzione_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.totale_costi_produzione_2024 || 0).toLocaleString()}</td>
    </tr>

    <tr>
      <td style={tdStyle}>Employee Cost</td>
      <td style={tdStyle}>{Number(selectedRowData?.costo_personale_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.costo_personale_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.costo_personale_2024 || 0).toLocaleString()}</td>
    </tr>

    <tr>
      <td style={tdStyle}>Depreciation</td>
      <td style={tdStyle}>{Number(selectedRowData?.ammortamenti_e_svalutazioni_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ammortamenti_e_svalutazioni_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ammortamenti_e_svalutazioni_2024 || 0).toLocaleString()}</td>
    </tr>

    <tr>
      <td style={tdStyle}>EBIT</td>
      <td style={tdStyle}>{Number(selectedRowData?.ebit_2022 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ebit_2023 || 0).toLocaleString()}</td>
      <td style={tdStyle}>{Number(selectedRowData?.ebit_2024 || 0).toLocaleString()}</td>
    </tr>
  </tbody>
</table>
<h2
  style={{
    padding: "18px 22px",
    margin: 0,
    background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
    color: "#fff",
    marginTop: "20px",
  }}
>
  20 Assets Balance Sheet
</h2>

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
      <td style={tdStyle}>Intangible Assets</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_immateriali_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_immateriali_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_immateriali_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Tangible Assets</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_materiali_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_materiali_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.immobilizzazioni_materiali_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Receivables</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.crediti_verso_clienti_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.crediti_verso_clienti_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.crediti_verso_clienti_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Cash & Cash Equivalents</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.disponibilita_liquide_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.disponibilita_liquide_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.disponibilita_liquide_2024 || 0).toLocaleString()}
      </td>
    </tr>
  </tbody>
</table>
<h2
  style={{
    padding: "18px 22px",
    margin: 0,
    background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
    color: "#fff",
    marginTop: "20px",
  }}
>
  30 Liabilities Balance Sheet
</h2>

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
      <td style={tdStyle}>Total Payables</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.totale_debiti_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.totale_debiti_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.totale_debiti_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Payables within 12 Months</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_entro_12_mesi_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_entro_12_mesi_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_entro_12_mesi_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Payables beyond 12 Months</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_oltre_12_mesi_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_oltre_12_mesi_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.debiti_oltre_12_mesi_2024 || 0).toLocaleString()}
      </td>
    </tr>

    <tr>
      <td style={tdStyle}>Employee Severance Fund (TFR)</td>
      <td style={tdStyle}>
        {Number(selectedRowData?.trattamento_fine_rapporto_2022 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.trattamento_fine_rapporto_2023 || 0).toLocaleString()}
      </td>
      <td style={tdStyle}>
        {Number(selectedRowData?.trattamento_fine_rapporto_2024 || 0).toLocaleString()}
      </td>
    </tr>
  </tbody>
</table>
 
 
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
 
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  <Typography>
    {item.label}
  </Typography>

{scheduleStatus[
  ["05", "10", "20", "30", "40", "50", "60", "70"].includes(item.code)
    ? `S${item.code}`
    : item.code
] && (
  <span
    style={{
      color: "green",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    ✓
  </span>
)}
</Box>
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
 
 