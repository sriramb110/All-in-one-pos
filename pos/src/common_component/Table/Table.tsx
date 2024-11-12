import { Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

interface Props {
  rows: any[];
  columns: GridColDef[];
  onSelectionChange: (selectedRows: any[]) => void;
}

function Table({ rows, columns, onSelectionChange }: Props) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5});

  const handleSelectionChange = (newSelection: any) => {
    const selectedData = rows.filter((row) => newSelection.includes(row._id));
    onSelectionChange(selectedData);
  };

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(data) => data._id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10 , 30, ]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
        sx={{ border: 1 }}
      />
    </Paper>
  );
}

export default Table;
