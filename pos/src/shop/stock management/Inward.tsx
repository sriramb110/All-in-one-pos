import React, { useEffect, useState } from "react";
import {
  category,
  postStack,
  product,
  stockInward,
} from "../../common_component/services";
import { CategoryInterface, ProductInterface, StockRecord } from "../Interface";
import Loading from "../../common_component/Loading";
import { GridColDef } from "@mui/x-data-grid";
import OrderTable from "../../common_component/Table/OrderTable";
import { useSearch } from "../../common_component/menu/SearchContext";
import { TextField } from "@mui/material";

function Inward() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm } = useSearch();
  const [categorys, setCategorys] = useState<CategoryInterface[]>([]);
  const [agency, setAgency] = useState<string>();
  const [showHistory, setShowHistory] = useState(false);
  const [inward, setInward] = useState<StockRecord[]>([]);
  const [selected, setSelected] = useState<StockRecord| null>()

  useEffect(() => {
    getProduct();
    getInward();
  }, []);

  const getProduct = () => {
    setIsLoading(true);
    product()
      .then((res) => {
        const getproducts: ProductInterface[] = res.data;
        category()
          .then((res) => {
            const categoryName: CategoryInterface[] = res.data;
            setCategorys(categoryName);
          })
          .catch((error) => {
            console.error("error", error);
          });
        const sortedProducts = getproducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        setProducts(sortedProducts);
        setFilterProduct(sortedProducts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const getInward = () => {
    stockInward()
      .then((res) => {
        const inwarddata: StockRecord[] = res.data
        setInward(inwarddata)
      })
      .catch((error) => console.error(error));
  };
  const categoryLookup = categorys.reduce((acc, category) => {
    acc[category._id] = category.name;
    return acc;
  }, {} as Record<string, string>);
  const filteredData = filterProduct
    .filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => ({
      id: item._id,
      serial: index + 1,
      productName: item.productName,
      categoryType: categoryLookup[item.categoryType],
      // stock: item.stock,
      inward: item.inward,
      buyprice: item.buyprice,
      // amount: item.amount,
    }));

  const inwardFilteredData = inward
    .filter((item) =>
      item.AgencyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => ({
      id: item._id,
      serial: index + 1,
      Date: item.Date,
      AgencyName: item.AgencyName,
      inward: item.totalInward,
      buyprice: item.totalBuyPrice,
    }));

  const inwardColumns: GridColDef[] = [
    {
      field: "serial",
      headerName: "S.No",
      type: "number",
      flex: 0.3,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "AgencyName",
      headerName: "Agency Name",
      flex: 1,
    },
    {
      field: "inward",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "buyprice",
      headerName: "Total Buy Price",
      flex: 1,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "S.No",
      type: "number",
      flex: 0.3,
      sortable: false,
      disableColumnMenu: true,
    },
    { field: "productName", headerName: "Product Name", flex: 1 },
    { field: "categoryType", headerName: "Category Type", flex: 1 },
    {
      field: "inward",
      headerName: "Inward",
      flex: 0.7,
      renderCell: (params) => {
        const product = filterProduct.find((p) => p._id === params.id);
        return (
          <input
            type="text"
            min="0"
            placeholder="Enter Qty"
            onChange={(e) => handleInward(e, params.id)}
            value={product?.inward || ""}
            className="w-full border border-black m-1 h-10"
          />
        );
      },
    },
    {
      field: "buyprice",
      headerName: "Buy Price",
      flex: 0.7,
      renderCell: (params) => {
        const product = filterProduct.find((p) => p._id === params.id);
        return (
          <input
            type="text"
            min="0"
            placeholder="Enter Price"
            onChange={(e) => handleBuyPrice(e, params.id)}
            value={product?.buyprice || ""}
            className="w-full border border-black m-1 h-10"
          />
        );
      },
    },
  ];

  const handleInward = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      alert("Only numbers are allowed");
      e.target.value = value.replace(/\D/g, "");
      return;
    }

    const numericValue = parseInt(value, 10);

    if (numericValue < 0) {
      e.target.value = "0";
      return;
    }

    const updatedProducts = filterProduct.map((product) =>
      product._id === id ? { ...product, inward: numericValue } : product
    );
    setFilterProduct(updatedProducts);
  };

  const handleBuyPrice = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      alert("Only numbers are allowed");
      e.target.value = value.replace(/\D/g, "");
      return;
    }

    const numericValue = parseInt(value, 10);

    if (numericValue < 0) {
      e.target.value = "0";
      return;
    }

    const updatedProducts = filterProduct.map((product) =>
      product._id === id ? { ...product, buyprice: numericValue } : product
    );
    setFilterProduct(updatedProducts);
  };

  const handleSelectedData = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleRowClick = (id: string | number) => {
    console.log("Clicked row ID:", id);
    if (showHistory) {
      const hisData = inward.filter((i) => i._id === id)
      setSelected(hisData[0])

    }
  };



  const inwardDetails = () => {
    const PRODUCTS = filterProduct.filter((i) => i.inward && i.inward > 0);
    // setUpdateProducts(PRODUCTS)

    if (PRODUCTS.length === 0) {
      return <div>No inward details to display.</div>;
    }

    return (
      <div>
        <h1>InWard List</h1>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100 ">
              <th className="border border-gray-400 p-2">S.No</th>
              <th className="border border-gray-400 p-2">Product Name</th>
              <th className="border border-gray-400 p-2">Inward Quantity</th>
              <th className="border border-gray-400 p-2">Buy Price</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((product, index) => (
              <tr key={product._id}>
                <td className="border border-gray-400 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-400 p-2">
                  {product.productName}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {product.inward}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {product.buyprice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TOTALPRICE = filterProduct.reduce((total, product) => {
    return total + (product.buyprice || 0);
  }, 0);

  const TOTALQTY = filterProduct.reduce((total, product) => {
    return total + (product.inward || 0);
  }, 0);

  const updateStock = () => {
    const indianDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).split('/').reverse().join('-');

    const Stock = {
      AgencyName: agency,
      StockInward: filterProduct
        .filter((i) => i.inward > 0)
        .map((i) => ({ id: i._id, buyprice: i.buyprice, inward: i.inward })),
      Date: indianDate, 
    };

    postStack(Stock)
      .then((res) => {
        const clearedProducts = filterProduct.map((product) => ({
          ...product,
          inward: 0,
          buyprice: 0,
        }));

        setFilterProduct(clearedProducts);
        setAgency("");
        getProduct();
        getInward();
      })
      .catch((error) => console.error(error));
  };


  const btnEnable = agency && filterProduct.some((i) => i.inward > 0);

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const oldData = () => {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        <div>
          <button className="confirm" onClick={()=>setSelected(null)}>Back to History</button>
        </div>
          <div className="flex justify-between  px-5">
            <h1>Agency Name : {selected?.AgencyName}</h1>
            <h1>Date : {selected?.Date}</h1>
          </div>
          <div className="flex justify-between  px-5">
            <p>Total Items : {selected?.totalInward}</p>
            <p>Total Price : {selected?.totalBuyPrice}</p>
          </div>
        <div className="w-full h-5/6 flex flex-col overflow-x-auto">
          <div className="flex p-4 h-full ">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100 ">
                  <th className="border border-gray-400 p-2">S.No</th>
                  <th className="border border-gray-400 p-2">Product Name</th>
                  <th className="border border-gray-400 p-2">Inward Quantity</th>
                  <th className="border border-gray-400 p-2">Buy Price</th>
                </tr>
              </thead>
              <tbody>
                {selected?.StockInward.map((product, index) => (
                  <tr key={product.id}>
                    <td className="border border-gray-400 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {product.productName}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {product.inward}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {product.buyprice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

      </div>
    )

  }

  return (
    <div className="w-full h-full mt-5 bg-gray-100 gap-1 flex">
      {isLoading && <Loading />}
      <div className="w-full flex flex-col h-full">
        <div
          className={` p-0.5 h-full flex flex-col rounded-lg shadow-xl transition-transform duration-500 ${!showHistory ? "hidden" : "transform translate-y-1"
            }`}
        >
          <h1>History</h1>
          <div className="h-5/6">
            {!selected ? <OrderTable
              rows={inwardFilteredData}
              columns={inwardColumns}
              onSelectionChange={handleSelectedData}
              onRowClick={handleRowClick}
            /> : oldData()}
          </div>
        </div>
        <div
          className={`p-0.5 h-full transition-transform duration-75 ${showHistory ? "transform translate-y-11 opacity-50 pointer-events-none" : ""}`}
        >
          <div className="h-5/6">
            <OrderTable
              rows={filteredData}
              columns={columns}
              onSelectionChange={handleSelectedData}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>

      <div className="w-2/6 h-5/6 p-3 bg-white rounded-lg shadow-xl">
        <div className="w-full h-full border border-black rounded-lg flex flex-col p-1">
          <div className="h-20 w-full justify-between px-2 flex items-center">
            <button className="confirm" onClick={()=>{ toggleHistory(); setSelected(null) }}>
              {showHistory ? "Back" : "History"}
            </button>
            <button
              className={`${btnEnable ? "confirm" : "confirm_disable"}`}
              disabled={!btnEnable}
              onClick={updateStock}
            >
              Update Inward Items
            </button>
          </div>
          <div className="flex gap-1">
            <TextField
              id="outlined-basic"
              label="Agency Name"
              variant="outlined"
              value={agency}
              disabled={showHistory}
              onChange={(e) => setAgency(e.target.value)}
            />
            <TextField
              id="Total Price"
              label="Total Price"
              disabled
              value={TOTALPRICE.toFixed(2)}
            ></TextField>
            <TextField
              id="Total QTY"
              label="Total QTY"
              disabled
              value={TOTALQTY}
            ></TextField>
          </div>
          <div className="h-5/6 w-full overflow-x-auto">{inwardDetails()}</div>
        </div>
      </div>
    </div>
  );
}

export default Inward;
