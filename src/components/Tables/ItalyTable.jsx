import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
 
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
 
const ItalyTable = () => {
  const navigate = useNavigate();
 
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
 
  // server side filters
  const [columnFilters, setColumnFilters] = useState([]);
 
  // fetch data
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
 
          // Company Code
          if (filter.id === "codice_fiscale") {
            params.append("company_code", value);
          }
 
          // Company Name
          if (filter.id === "denominazione") {
            params.append("company_name", value);
          }
 
          // City
          if (filter.id === "comune") {
            params.append("city", value);
          }
 
          // Industry Code
          if (filter.id === "codice_ateco") {
            params.append("industry_code", value);
          }
 
          // Revenue
          if (filter.id === "ricavi_operativi_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
 
              params.append("revenue_min", min.trim());
              params.append("revenue_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append(
                "revenue_min",
                value.replace(">", "").trim()
              );
            } else if (value.startsWith("<")) {
              params.append(
                "revenue_max",
                value.replace("<", "").trim()
              );
            } else {
              params.append("revenue_min", value);
            }
          }
 
          // EBIT
          if (filter.id === "ebit_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
 
              params.append("ebit_min", min.trim());
              params.append("ebit_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append(
                "ebit_min",
                value.replace(">", "").trim()
              );
            } else if (value.startsWith("<")) {
              params.append(
                "ebit_max",
                value.replace("<", "").trim()
              );
            } else {
              params.append("ebit_min", value);
            }
          }
 
          // Employees
          if (filter.id === "numero_dipendenti_2024") {
            if (value.includes("-")) {
              const [min, max] = value.split("-");
 
              params.append("employees_min", min.trim());
              params.append("employees_max", max.trim());
            } else if (value.startsWith(">")) {
              params.append(
                "employees_min",
                value.replace(">", "").trim()
              );
            } else if (value.startsWith("<")) {
              params.append(
                "employees_max",
                value.replace("<", "").trim()
              );
            } else {

  // exact value search
  params.append("employees_min", value.trim());
  params.append("employees_max", value.trim());
}
          }
        });
 
        // TWO APIs
        const url = hasFilters
          ? `http://43.205.207.160:1701/api/italy-search-columns?${params.toString()}`
          : `http://43.205.207.160:1701/api/italy-get-all-records?page=1`;
 
        console.log("API URL:", url);
 
        const response = await fetch(url);
 
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
 
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
      {
        accessorKey: "codice_fiscale",
        header: "Company Code",
      },
      {
        accessorKey: "denominazione",
        header: "Company Name",
      },
      {
        accessorKey: "comune",
        header: "City",
      },
      {
        accessorKey: "codice_ateco",
        header: "Industry Code",
      },
      {
        accessorKey: "ricavi_operativi_2024",
        header: "Revenue 2024",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-US"),
      },
      {
        accessorKey: "ebit_2024",
        header: "EBIT 2024",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-US"),
      },
      {
        accessorKey: "numero_dipendenti_2024",
        header: "Employees 2024",
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString("en-US"),
      },
    ],
    []
  );
 
  // single row selection
  const handleRowSelection = (rowId) => {
    setRowSelection({
      [rowId]: true,
    });
  };
 
  const handleFetchReports = () => {
    const selectedRow =
      table.getSelectedRowModel().rows[0];
 
    if (!selectedRow) return;
 
    navigate("/italy-reports", {
      state: {
        companyCodes: [
          selectedRow.original.codice_fiscale,
        ],
      },
    });
  };
 
  const table = useMaterialReactTable({
    columns,
    data,
 
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: false,
 
    // IMPORTANT
    manualFiltering: true,
 
    onColumnFiltersChange: setColumnFilters,
 
    getRowId: (row) => row.codice_fiscale,
 
    state: {
      rowSelection,
      isLoading,
      showAlertBanner: isError,
      columnFilters,
    },
 
    muiSelectCheckboxProps: ({ row }) => ({
      checked: !!rowSelection[row.id],
      onChange: () =>
        handleRowSelection(row.id),
    }),
 
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      showColumnFilters: true,
      showGlobalFilter: false,
    },
 
    renderTopToolbarCustomActions: () => (
      <button
        onClick={handleFetchReports}
        disabled={
          table.getSelectedRowModel().rows.length ===
          0
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
    ),
 
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
  });
 
  return (
    <MaterialReactTable table={table} />
  );
};
 
export default ItalyTable;
 