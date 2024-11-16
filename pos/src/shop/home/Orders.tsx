import React from "react";
import { ProductInterface } from "../Interface";

type OrdersProps = {
  products: ProductInterface[];
};

function Orders({ products }: OrdersProps) {
  const productNull = () => {
    if (products.length === 0) {
      console.log("No data");
      return <div>No Product</div>;
    }
  };

  return (
    <div className="w-full h-full bg-zinc-400 p-2 overflow-hidden">
      <div className="bg-white h-auto p-5 flex flex-wrap gap-2 overflow-auto">
        {products.map((i) => (
          <div
            key={i._id} 
            className="px-2 mx-2 my-1 w-28 h-28 flex border-2 justify-center items-center border-gray-600 rounded-md bg-zinc-400 text-white text-xl shadow-md cursor-pointer"
          >
            {i.productName}
          </div>
        ))}
        {productNull()}
      </div>
    </div>
  );
}

export default Orders;
