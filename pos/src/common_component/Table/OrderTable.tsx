import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
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

  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    const selectedData = rows.filter((row) => selectionModel.includes(row.id));
    onSelectionChange(selectedData);
  };

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%", 
        minHeight: 400,
        padding: 2,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[30, 50]}
        // checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) =>
          handleSelectionChange(newSelection)
        }
        onRowClick={(params) => {
          if (onRowClick) {
            onRowClick(params.id);
          }
        }}
        sx={{
          border: 1,
          width: "100%", 
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </Paper>
  );
}

export default OrderTable;
