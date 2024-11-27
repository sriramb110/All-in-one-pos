import React, { useEffect, useState } from "react";
import Orders from "./Orders";
import Calculations from "./Calculations";
import Confirm from "./Confirm";
import {
  category,
  product,
  getCustomer,
} from "../../common_component/services";
import {
  CategoryInterface,
  Customer,
  ProductInterface,
  ProductSelected,
} from "../Interface";
import { Link } from "react-router-dom";
import Orderspopup from "./Orderspopup";
import Loading from "../../common_component/Loading";
import { Autocomplete, TextField } from "@mui/material";

function Home() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [categorys, setCategory] = useState<CategoryInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);
  const [selectCategory, setSelectCategory] = useState<any>({
    name: "All Products",
  });
  const [selectenProduct, setSelectedProduct] = useState<any>();
  const [allProduct, setAllProduct] = useState<any>();
  const [orderList, setOrderlist] = useState<ProductSelected[]>([]);
  const [ConfirmOrder, setConfirmOrder] = useState<boolean>();
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [selectCus, setSelectCus] = useState<Customer | null | undefined>();
  const [loading, setLoading] = useState(false);
  const [defoltset, setDefoltset] = useState<{ label: string; value: string } | null>({ label: 'All Products', value:'' });
  const [totalOrderAmount,setTotalOrderAmount] = useState<number>(0)

  useEffect(() => {
    getProduct();
    getCategory();
  }, []);

  const getProduct = () => {
    setLoading(true);
    product()
      .then((res) => {
        const getproducts: ProductInterface[] = res.data;
        const shortProduct = getproducts.sort((a, b) => {
          return a.productName.localeCompare(b.productName);
        });
        setProducts(shortProduct);
        setFilterProduct(shortProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getCategory = () => {
    setLoading(true);
    category()
      .then((res) => {
        const getCategoryes: CategoryInterface[] = res.data;
        const allCategory = {
          _id: "",
          name: "All Products",
        };
        setCategory([allCategory, ...getCategoryes]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const customers = () => {
    setLoading(true);
    getCustomer()
      .then((res) => {
        const customersData: Customer[] = res.data;
        setCustomer(customersData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const filtercategory = (id: any) => {
    if (id) {
      const Category = categorys.find((i) => i._id === id);
      setSelectCategory(Category);
      const filter = products.filter((i) => i.categoryType === id);
      setFilterProduct(filter);
    } else {
      setSelectCategory({ name: "All Products" });
      setFilterProduct(products);
    }
  };

  const selectedProduct = (id: string) => {
    const selectedProduct = products.find((i) => i._id === id);
    if (!selectedProduct) return;

    const categoryType = categorys.find(
      (i) => i._id === selectedProduct.categoryType
    );

    const selectDetails: ProductSelected = {
      ProductName: selectedProduct.productName,
      CategoryType: categoryType ? categoryType.name : "Unknown",
      Amount: selectedProduct.amount.toString(),
      orderQty: 1,
      ids: {
        CategoryId: categoryType?._id || "",
        ProductId: selectedProduct._id,
      },
    };
    setSelectedProduct(selectDetails);
    setTimeout(() => {
      setSelectedProduct("");
    }, 10);
  };

  const productList = (orderlists: ProductSelected[]) => {
    setOrderlist(orderlists);
  };

  const clear = () => {
    clearAll();
  };

  const clearAll = () => {
    setSelectedProduct("");
    setOrderlist([]);
    setAllProduct("clear");
    setSelectCus(null);
    setTimeout(() => {
      setAllProduct("");
    }, 10);
  };

  const data = () => {
    clearAll();
  };

  const confirmOrders = () => {
    customers();
    setConfirmOrder(true);
  };

  const refresh = () => {
    customers();
  };

  const backHome = () => {
    setConfirmOrder(false);
    clearAll();
    setSelectCus(null);
  };

  const customersData = (data: Customer | null | undefined) => {
    setSelectCus(data);
  };

  const newProductsadded = () => {
    setConfirmOrder(false);
  };

    const productData = categorys.map((i) => ({
      label: i.name,
      value: i._id,
    }));
  // setDefoltset(productData[0])

  const totalAmount = (orderAmount:number)=>{
    setTotalOrderAmount(orderAmount)
  }

  return (
    <div className="w-full h-full flex flex-col -mt-3 pb-5 bg-gray-100">
      <div className="flex flex-grow w-full h-5/6 p-4">
        <div className="w-full pr-4 h-full flex flex-col">
          <div className="sidebar W-full flex justify-between items-center mx-2 mt-3">
            <h1 className="text-2xl font-semibold ">
              Category Type: {selectCategory?.name || "Select a Category"}
            </h1>
            <Link
              to={"/setting/products"}
              className=" px-2 mx-2 my-1 w-64 h-10 flex flex-col border-2 justify-center items-center border-gray-600 rounded-md bg-indigo-500 text-white text-xl shadow-md cursor-pointer"
            >
              + Products or Category
            </Link>
          </div>
          <div className="openpopup w-full flex justify-between items-center">
            <Autocomplete
              className="w-80 mx-5 mt-2 mb-2"
              options={productData}
              value={defoltset}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
              <TextField {...params} label="Filter by Category" />
              )}
              onChange={(event, newValue) => {
                filtercategory(newValue?.value || null);
                setDefoltset(newValue);
              }}
            />
            <div className="w-60 flex justify-end gap-2 bg-gray-50 p-2 rounded-lg border-gray-300 border shadow-inner">
              <p className="font-bold w-2/6">Order Price : </p>
              <p className="font-semibold text-4xl w-4/6 text-red-500">{totalOrderAmount.toFixed(2)}</p>
            </div>

          </div>
          <div className="flex-1 mt-5 w-full  overflow-hidden border rounded-md py-2 bg-white shadow-md">
            <h1 className="ml-3">Products List</h1>
            <Orders products={filterProduct} selectproduct={selectedProduct} />
          </div>
        </div>

        <div className="w-2/6 min-w-96 h-full flex flex-col">
          <div className="h-full border rounded-md p-4 bg-white shadow-md">
            <Calculations
              orderProducts={selectenProduct}
              listOfProducts={productList}
              clearall={clear}
              allProduct={allProduct}
              confirmOrders={confirmOrders}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-1/6 p-4 border-t shadow-md overflow-auto sidebar">
        <Confirm
          categorys={categorys}
          category={filtercategory}
          orderList={orderList}
          clearorder={data}
          confirmOrders={confirmOrders}
        />
      </div>

      {loading && <Loading />}

      {ConfirmOrder && (
        <div className="modalOrders">
          <Orderspopup
            orderList={orderList}
            customer={customer}
            refresh={refresh}
            backHome={backHome}
            selectedCustomers={customersData}
            addProducts={newProductsadded}
            selectCus={selectCus}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
