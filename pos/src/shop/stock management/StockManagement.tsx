import React, { useEffect, useState } from "react";
import { category, product } from "../../common_component/services";
import { CategoryInterface, ProductInterface } from "../Interface";
import Loading from "../../common_component/Loading";
import { GridColDef } from "@mui/x-data-grid";
import OrderTable from "../../common_component/Table/OrderTable";
import { useSearch } from "../../common_component/menu/SearchContext";

function StockManagement() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm } = useSearch();
  const [categorys, setCategorys] = useState<CategoryInterface[]>([])

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    setIsLoading(true);
    product()
      .then((res) => {
        const getproducts: ProductInterface[] = res.data;
        category().then((res) => {
              const categoryName: CategoryInterface[] = res.data
              setCategorys(categoryName);
            }).catch((error) => {
              console.error('error', error);
            })
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
      stock: item.stock,
      inward: "",
      amount: item.amount,
    }));

  const columns: GridColDef[] = [
    { field: "serial", headerName: "S.No", type: "number", flex: 0.2 },
    { field: "productName", headerName: "Product Name", flex: 1 },
    { field: "categoryType", headerName: "Category Type", flex: 1 },
    { field: "stock", headerName: "Quantity", flex: 0.7, type: "number" },
    {
      field: "inward",
      headerName: "Inward",
      flex: 0.7,
      renderCell: (params) => (
        <input
          type="text"
          min="0"
          onChange={(e) => handleInputChange(e, params.id)}
          defaultValue={params.value || ""}
          style={{ width: "100%" }}
        />
      ),
    },
    { field: "", headerName: "Outward", flex: 0.7, type: "number" },
    { field: "amount", headerName: "Price", flex: 0.7, type: "number" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number
  ) => {
    const value = e.target.value;

    // Ensure the input is numeric
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

    console.log(`Updated inward for row ${id}:`, numericValue);
  };




  const handleSelectedData = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleRowClick = (id: string | number) => {
    console.log("Clicked row ID:", id);
  };

  return (
    <div className="w-full h-full bg-gray-100 pb-8">
      {isLoading && <Loading />}
      <div className="w-5/6 h-full p-0.5">
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


export default StockManagement;
