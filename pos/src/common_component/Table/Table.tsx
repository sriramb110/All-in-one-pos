import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

interface Props {
  rows: any[];
  columns: GridColDef[];
  onSelectionChange: (selectedRows: any[]) => void;
}

function Table({ rows, columns, onSelectionChange }: Props) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10});

  const handleSelectionChange = (newSelection: any) => {
    const selectedData = rows.filter((row) => newSelection.includes(row._id));
    onSelectionChange(selectedData);
  };

  return (
    <Paper sx={{
      height: "100%",
      width: "100%",
      minHeight: 400,
      padding: 2,
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(data) => data._id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10 , 30, 50]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
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

export default Table;
