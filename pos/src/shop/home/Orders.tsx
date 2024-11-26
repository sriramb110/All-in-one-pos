import React from "react";
import { ProductInterface } from "../Interface";
import { Link } from "react-router-dom";

type OrdersProps = {
  products: ProductInterface[];
  selectproduct: (id: string) => void;
};

function Orders({ products, selectproduct }: OrdersProps) {
  const productNull = () => {
    // Return a "No Product" link when products array is empty
    if (products.length === 0) {
      return (
        <Link
          to="/setting/products"
          className="px-4 py-2 mx-2 my-2 w-full flex justify-center items-center border-2 border-gray-600 rounded-md bg-red-500 text-white text-lg shadow-md cursor-pointer hover:bg-red-600"
        >
          Add Product
        </Link>
      );
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="bg-white h-auto p-5 flex flex-wrap gap-4 overflow-auto justify-start">
        {products.length > 0
          ? products.map((product) => (
              <div
                key={product._id}
                onClick={() => selectproduct(product._id)}
              className="px-2 py-3 w-28 h-28 flex flex-col justify-between items-center border-2 border-gray-600 rounded-md bg-indigo-500 text-white text-sm shadow-md cursor-pointer hover:bg-indigo-600  hover:text-cyan-50 responsive-container"
              >
                <p className="font-semibold">{product.productName}</p>
                <p className="text-sm">Price: {product.amount}</p>
              </div>
            ))
          : productNull()}
      </div>
    </div>
  );
}

export default Orders;
