import React, { useEffect, useState } from "react";
import { sales } from "../../common_component/services";
import { ProductStock } from "../Interface";
import { GridColDef } from "@mui/x-data-grid";
import OrderTable from "../../common_component/Table/OrderTable";

interface DateState {
  From: Date;
  to: Date;
}

const Outward: React.FC = () => {
  const [date, setDate] = useState<DateState>({
    From: new Date(),
    to: new Date(),
  });

  const [salesProducts, setSalesPrdoucts] = useState<ProductStock[]>([])

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    const from = date.From;
    const to = date.to;
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    sales(from, to)
      .then((res) => setSalesPrdoucts(res.data))
      .catch((error) => setSalesPrdoucts([]));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "From" | "to"
  ) => {
    const newDate = new Date(e.target.value);
    setDate((prevDate) => ({
      ...prevDate,
      [type]: newDate,
    }));
  };

  const filteredData = salesProducts.map((item,index)=>({
    id: item.ProductName,
    serial: index + 1,
    productName: item.ProductName,
    salesQty:item.totalQty
  }))

  const columns: GridColDef[]=[
    {
      field: "serial",
      headerName: "S.No",
      type: "number",
      flex: 0.3,
      sortable: false,
      disableColumnMenu: true,
    },
    { field: "productName", headerName: "Product Name", flex: 1 },
    { field: "salesQty", headerName: "Total Sales Qty", flex: 1 },
  ]

  const handleSelectedData = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleRowClick = (id: string | number) => {
    console.log("Selected Rows:", id);
  };

  return (
    <div className="w-full h-full">
      <div className="flex h-20 w-full justify-end items-center p-2">
        <div>
          <label>From: </label>
          <input
            type="date"
            value={date.From.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e, "From")}
          />
        </div>
        <div>
          <label>To: </label>
          <input
            type="date"
            value={date.to.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e, "to")}
          />
        </div>
        <button className="confirm" onClick={getOrders}>
          Search
        </button>
      </div>
      <div className="w-full p-5 h-5/6">
        <OrderTable
          rows={filteredData}
          columns={columns}
          onSelectionChange={handleSelectedData}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default Outward;
