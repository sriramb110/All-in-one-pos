import React, { useEffect, useState } from "react";
import { category, product } from "../../common_component/services";
import { CategoryInterface, ProductInterface } from "../Interface";
import { useSearch } from "../../common_component/menu/SearchContext";
import { GridColDef } from "@mui/x-data-grid";
import OrderTable from "../../common_component/Table/OrderTable";
import Loading from "../../common_component/Loading";

function Stock() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchTerm } = useSearch();
  const [categorys, setCategorys] = useState<CategoryInterface[]>([]);
  useEffect(() => {
    getProducts();
  }, []);

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
      amount: item.amount,
      total: item.amount * Number(item.stock),
    }));

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
    { field: "stock", headerName: "Stock", flex: 1, type: "number" },
    { field: "amount", headerName: "Price", flex: 1, type: "number" },
    { field: "total", headerName: "Total Price", flex: 1, type: "number" },
  ];

  const getProducts = () => {
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

  const handleSelectedData = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
  };

  const handleRowClick = (id: string | number) => {
    console.log("Clicked row ID:", id);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="h-5/6">
        <OrderTable
          rows={filteredData}
          columns={columns}
          onSelectionChange={handleSelectedData}
          onRowClick={handleRowClick}
        />
      </div>
      {isLoading&& <Loading/>}
    </div>
  );
}

export default Stock;
