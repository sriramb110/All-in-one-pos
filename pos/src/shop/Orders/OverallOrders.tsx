import React, { useEffect, useState } from "react";
import { getOrders } from "../../common_component/services";
import { Order } from "../Interface";
import { useSearch } from "../../common_component/menu/SearchContext";
import { GridColDef } from "@mui/x-data-grid";
import OrderTable from "../../common_component/Table/OrderTable";
import { useNavigate } from "react-router-dom";
import Loading from "../../common_component/Loading";

function OverallOrders() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then((res) => {
        const ordersData: Order[] = res.data.orders;
        setOrderList(ordersData);
         setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

   if (loading) {
     return <Loading />;
   }

  const filteredData = orderList
    .filter(
      (order) =>
        order.Customerdata.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.Customerdata.phoneNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.orderId
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .map((order, index) => ({
      id: order._id,
      serial: index + 1,
      customerName: order.Customerdata.customerName,
      phoneNumber: order.Customerdata.phoneNumber,
      orderDate: order.Date_Time,
      orderId: order.orderId,
      orderAmount: order.totalPrice,
    }));

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "S.No",
      type: "number",
      width: 60,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "orderId",
      headerName: "Order Id",
      width: 300,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 300,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 130,
    },
    {
      field: "orderDate",
      headerName: " Order Date | Time",
      width: 200,
      type: "number",
    },
    {
      field: "orderAmount",
      headerName: "Order Amount",
      type: "number",
      width: 150,
    },
  ];

  const handleSelectedData = (selectedRows: any[]) => {
    // console.log("Selected Rows:", selectedRows);
  };
  const handleRowClick = (id: string | number) => {
    console.log("Clicked row ID:", id);
    navigate(`/order/${id}`);
  };

  return (
    <div className="w-full h-full mt-10 flex justify-center">
      <div className="h-5/6 flex w-auto ">
        <OrderTable
          rows={filteredData}
          columns={columns}
          onSelectionChange={handleSelectedData}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}

export default OverallOrders;
