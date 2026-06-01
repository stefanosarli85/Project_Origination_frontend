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
      "codice_ateco", "descrizione_ateco",
      "codice_ateco_secondario", "attivita_prevalente",
    ],
  },
  {
    label: "Financials",
    icon: <TrendingUpIcon fontSize="small" />,
    accent: "#6a1b9a",
    bg: "#f3e5f5",
    keys: [
      "ricavi_operativi_2024", "ebit_2024", "numero_dipendenti_2024",
      "ricavi_operativi_2023", "ebit_2023", "numero_dipendenti_2023",
      "utile_netto_2024", "utile_netto_2023",
      "patrimonio_netto_2024", "patrimonio_netto_2023",
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
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          {entries.map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontSize: "0.65rem",
                  }}
                >
                  {fmtKey(key)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    mt: 0.25,
                    wordBreak: "break-word",
                  }}
                >
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
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

  const [columnFilters, setColumnFilters] = useState([]);

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

        const url = hasFilters
          ? `http://43.205.207.160:1701/api/italy-search-columns?${params.toString()}`
          : `http://43.205.207.160:1701/api/italy-get-all-records?page=1`;

        console.log("API URL:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const json = await response.json();
        console.log("API RESPONSE:", json);

        setData(json.data || []);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [columnFilters]);

  const columns = useMemo(
    () => [
      { accessorKey: "codice_fiscale", header: "Company Code" },
      { accessorKey: "denominazione", header: "Company Name" },
      { accessorKey: "comune", header: "City" },
      { accessorKey: "codice_ateco", header: "Industry Code" },
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

  const handleInfoClick = (row) => {
    setSelectedRowData(row.original);
    setModalOpen(true);
  };

  const handleFetchReports = () => {
    const selectedRow = table.getSelectedRowModel().rows[0];
    if (!selectedRow) return;
    navigate("/italy-reports", {
      state: { companyCodes: [selectedRow.original.codice_fiscale] },
    });
  };
const [isDownloading, setIsDownloading] = useState(false);
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
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.codice_fiscale,
    state: { rowSelection, isLoading, showAlertBanner: isError, columnFilters },
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

  // Leftover fields not covered by any group
  const otherEntries = selectedRowData
    ? Object.entries(selectedRowData).filter(
        ([k, v]) => !ALL_GROUPED_KEYS.has(k) && !HEADER_KEYS.has(k) && fmtValue(v) !== null
      )
    : [];

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
          {otherEntries.length > 0 && (
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderLeft: "4px solid #757575",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2, py: 1,
                  background: "#f5f5f5",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: "#616161", textTransform: "uppercase", letterSpacing: 1 }}
                >
                  Other Details
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={1.5}>
                  {otherEntries.map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          fontSize: "0.65rem",
                        }}
                      >
                        {fmtKey(key)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mt: 0.25, wordBreak: "break-word" }}
                      >
                        {fmtValue(value)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItalyTable;
