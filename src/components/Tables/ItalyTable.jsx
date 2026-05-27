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

  // fetch data from db.json
  useEffect(() => {
   const fetchData = async () => {
  try {
    setIsLoading(true);

    const response = await fetch(
      "http://43.205.207.160:1701/api/italy-get-all-records?page=1"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const json = await response.json();

    console.log("ITALY API:", json);
    console.log(json.data[0]);

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
  }, []);
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
      filterFn: "includesString",
    },
    {
      accessorKey: "codice_ateco",
      header: "Industry Code",
    },
    {
      accessorKey: "ricavi_operativi_2024",
      header: "Revenue 2024",
      filterFn: "customNumberFilter",
      Cell: ({ cell }) =>
        Number(cell.getValue()).toLocaleString("en-US"),
    },
    {
      accessorKey: "ebit_2024",
      header: "EBIT 2024",
      filterFn: "customNumberFilter",
      Cell: ({ cell }) =>
        Number(cell.getValue()).toLocaleString("en-US"),
    },
    {
      accessorKey: "numero_dipendenti_2024",
      header: "Employees 2024",
      filterFn: "customNumberFilter",
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
         selectedRow.original.codice_fiscale
        ],
      },
    });
  };


  const customNumberFilter = (
  row,
  columnId,
  filterValue
) => {
  const value = Number(
    String(row.getValue(columnId)).replace(/,/g, "")
  );

  if (!filterValue) return true;

  const parseValue = (val) => {
    val = val.toUpperCase().replace(/,/g, "").trim();

    if (val.includes("M")) {
      return parseFloat(val) * 1000000;
    }

    if (val.includes("K")) {
      return parseFloat(val) * 1000;
    }

    return Number(val);
  };

  const input = filterValue
    .toString()
    .toUpperCase()
    .replace(/\s/g, "")
    .trim();

  // range: 5M-10M
  if (input.includes("-")) {
    const [min, max] = input.split("-");

    return (
      value >= parseValue(min) &&
      value <= parseValue(max)
    );
  }

  // >=
  if (input.startsWith(">=")) {
    return value >= parseValue(input.slice(2));
  }

  // <=
  if (input.startsWith("<=")) {
    return value <= parseValue(input.slice(2));
  }

  // >
  if (input.startsWith(">")) {
    return value > parseValue(input.slice(1));
  }

  // <
  if (input.startsWith("<")) {
    return value < parseValue(input.slice(1));
  }

  return value === parseValue(input);
};

  const table = useMaterialReactTable({

    columns,
    data,
    filterFns: {
  customNumberFilter,
},

    enableRowSelection: true,
    enableMultiRowSelection: false,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: false,

    getRowId: (row) => row.codice_fiscale,
    state: {
      rowSelection,
      isLoading,
      showAlertBanner: isError,
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
  sorting: [
    {
      id: "Ricavi Operativi 2024",
      desc: true,
    },
  ],
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