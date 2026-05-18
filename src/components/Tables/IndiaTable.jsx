import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const IndiaTable = () => {
  const navigate = useNavigate();

  // table data state
  const [data, setData] = useState([]);

  // row selection state
  const [rowSelection, setRowSelection] = useState({});

  // loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/users");
        const json = await response.json();
        setData(json);
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

  // columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "companyCode",
        header: "Company Code",
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
      },
      {
        accessorKey: "industry",
        header: "Industry",
      },
      {
        accessorKey: "symbol",
        header: "NSE Symbol",
      },
      {
        accessorKey: "totalIncome2025",
        header: "Total Income 2025",
      },
      {
        accessorKey: "pat2025",
        header: "PAT 2025",
      },
    ],
    [],
  );

  // navigate with selected company codes
  const handleFetchReports = () => {
    const selectedCompanyCodes = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.companyCode);

    navigate("/reports", {
      state: {
        companyCodes: selectedCompanyCodes,
      },
    });
  };

  // MRT table
  const table = useMaterialReactTable({
    columns,
    data,

    enableRowSelection: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnFilters: true,

    getRowId: (row) => row.companyCode,

    onRowSelectionChange: setRowSelection,

    state: {
      rowSelection,
      isLoading,
      showAlertBanner: isError,
    },

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      showColumnFilters: true,
    },

    renderTopToolbarCustomActions: () => (
      <button
        onClick={handleFetchReports}
        disabled={table.getSelectedRowModel().rows.length === 0}
        style={{
          padding: "10px 16px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
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

  return <MaterialReactTable table={table} />;
};

export default IndiaTable;
