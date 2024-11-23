import React, { useEffect, useState } from "react";
import { getLedger } from "../../common_component/services";
import { LedgerResponse } from "../Interface";
import { useSearch } from "../../common_component/menu/SearchContext";
import OrderTable from "../../common_component/Table/OrderTable";
import { GridColDef } from "@mui/x-data-grid";

function CustomerLedger() {
  const [ledgers, setLedgers] = useState<LedgerResponse[]>([]);
  const { searchTerm } = useSearch();
  useEffect(() => {
    getLedgers();
    
  }, []);
  const getLedgers = () => {
    getLedger()
      .then((res) => {
        const ledger: LedgerResponse[] = res.data.data;
        setLedgers(ledger);
      })
      .catch((error) => console.log(error));
  };

  const overallOSB =()=> {
    const ledger = ledgers.map((i)=>Number(i.OSB))
     const totalOSB = ledger.reduce((acc, curr) => acc + curr, 0);
    return(totalOSB.toFixed(2))
  }
  const filteredData = ledgers
    .filter(
      (ledgers) =>
        ledgers.customerDetails.phoneNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ledgers.customerDetails.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .map((order, index) => ({
      id: order.customerDetails.phoneNumber,
      serial: index + 1,
      CustomerName: order.customerDetails.customerName,
      PNumber: order.customerDetails.phoneNumber,
      Email:order.customerDetails.emailId,
      osb: Number(order.OSB).toFixed(2),
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
      field: "CustomerName",
      headerName: "Customer Name",
      width: 300,
    },
    {
      field: "PNumber",
      headerName: "Phone Number",
      width: 250,
    },
    {
      field: "Email",
      headerName: "Email Id",
      width: 350,
    },
    {
      field: "osb",
      headerName: "Out Standing Balance",
      width: 250,
      type: "number",
    },
  ];

    const handleSelectedData = (selectedRows: any[]) => {
    };
    const handleRowClick = (id: string | number) => {
      console.log("Clicked row ID:", id);
    };
  return (
    <div className="w-full h-full p-2 pb-10">
      <div className="fixed right-0 w-80 h-20 bg-gray-200 m-2 p-1 rounded-lg shadow-xl top-16 z-10">
        <div className="w-full h-full flex p-1 border rounded-lg shadow-inner bg-white">
          <p>Over all Account balance :</p>
          <p className="w-1/2 flex justify-end items-center font-semibold text-2xl ">
            {overallOSB()}
          </p>
        </div>
      </div>
      <div className="w-full h-full pt-10 p-2">
        <h1>Customer Ludger Balance Details :</h1>
        <div className="w-auto flex p-5 h-full justify-center">

        <OrderTable
           rows={filteredData}
          columns={columns}
          onSelectionChange={handleSelectedData}
          onRowClick={handleRowClick}
        />
        </div>
      </div>
    </div>
  );
}

export default CustomerLedger;
