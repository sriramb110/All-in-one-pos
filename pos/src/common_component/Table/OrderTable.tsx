import { Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

interface Props {
  rows: any[];
  columns: GridColDef[];
  onSelectionChange: (selectedRows: any[]) => void;
  onRowClick?: (id: string | number) => void;
}

function OrderTable({ rows, columns, onSelectionChange, onRowClick }: Props) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 30,
  });

  const handleSelectionChange = (selectionModel: any) => {
    const selectedData = rows.filter((row) => selectionModel.includes(row.id));
    onSelectionChange(selectedData);
  };

  return (
    <Paper sx={{ height: "100%", width: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[30, 50]}
        // checkboxSelection
        onRowSelectionModelChange={(newSelection) =>
          handleSelectionChange(newSelection)
        }
        onRowClick={(params) => {
          if (onRowClick) {
            onRowClick(params.id);
          }
        }}
        sx={{ border: 1 }}
      />
    </Paper>
  );
}

export default OrderTable;
