import React, { useState } from "react";
import { CategoryInterface, ProductSelected } from "../Interface";

type CategoryProps = {
  categorys: CategoryInterface[];
  category: (id: string) => void;
  orderList: ProductSelected[];
  clearorder: () => void;
  confirmOrders:() => void;
};

function Confirm({
  categorys,
  category,
  orderList,
  clearorder,
  confirmOrders,
}: CategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleClick = (id: string) => {
    setSelectedCategoryId(id);
    category(id);
  };

  return (
    <div className="w-full h-full flex">
      <div className="w-full bg-white h-full pt-2 flex flex-wrap border-2 border-black rounded-t-3xl">
        {categorys.map((i) => (
          <div
            key={i._id}
            onClick={() => handleClick(i._id)}
            className={`px-2 mx-2 my-1 flex border-2 rounded-md text-white text-xl shadow-md h-8 cursor-pointer ${
              selectedCategoryId === i._id
                ? "bg-blue-500 border-blue-700"
                : "bg-zinc-400 border-gray-600"
            }`}
          >
            {i.name}
          </div>
        ))}
      </div>
      <div className="w-2/6 min-w-96 h-5/6 p-2 overflow-hidden flex justify-center items-center">
        <button
          disabled={orderList.length === 0}
          aria-disabled={orderList.length === 0}
          className={`w-full h-full border rounded-md bg-green-500 text-white text-4xl ${
            orderList.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => confirmOrders()}
        >
          CHECKOUT
        </button>
        <button
          disabled={orderList.length === 0}
          aria-disabled={orderList.length === 0}
          className={`w-1/6 h-full bg-orange-300 border rounded-md font-semibold ${
            orderList.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => clearorder()}
        >
          Clear Order
        </button>
      </div>
    </div>
  );
}

export default Confirm;
