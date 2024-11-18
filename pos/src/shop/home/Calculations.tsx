import React, { useEffect, useRef, useState } from "react";
import { ProductSelected } from "../Interface";

type OrderProps = {
  orderProducts: ProductSelected;
  listOfProducts: (orderlists: ProductSelected[]) => void;
  clearall: () => void;
  allProduct: any;
};

function Calculations({
  orderProducts,
  listOfProducts,
  clearall,
  allProduct,
}: OrderProps) {
  const [orderlists, setOrderlists] = useState<ProductSelected[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (orderProducts && orderProducts.ids) {
      const isProductExists = orderlists.some(
        (item) => item.ids.ProductId === orderProducts.ids.ProductId
      );
      if (!isProductExists) {
        setOrderlists((prevList) => [...prevList, orderProducts]);
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [orderProducts.ids.ProductId]: orderProducts.orderQty || 1,
        }));
      }
    }

    if (allProduct) {
      setOrderlists([]);
    }
  }, [orderProducts, orderlists, allProduct]);

  const handleIncrement = (productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.min((prevQuantities[productId] || 1) + 1, 99),
    }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      const newQuantity = (updatedQuantities[productId] || 1) - 1;

      if (newQuantity < 1) {
        setOrderlists((prevOrderlists) =>
          prevOrderlists.filter(
            (product) => product.ids.ProductId !== productId
          )
        );
      } else {
        updatedQuantities[productId] = newQuantity;
      }

      return updatedQuantities;
    });
  };

  const handleLongPressStart = (productId: string) => {
    longPressTimer.current = setTimeout(() => {
      setOrderlists((prevList) =>
        prevList.filter((product) => product.ids.ProductId !== productId)
      );
    }, 1000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const totalOrderPrice = orderlists.reduce((acc, item) => {
    const amount = parseFloat(item.Amount) || 0;
    const quantity = quantities[item.ids.ProductId] || 1;
    return acc + amount * quantity;
  }, 0);

  const productValue = (pQty: ProductSelected, qty: number, price: number) => {
    pQty.orderQty = qty;
    listOfProducts(orderlists);
    return qty * price;
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-2">
      <div className="w-full h-1/6 overflow-hidden border rounded-md p-4 flex justify-center items-center flex-col bg-white shadow-md">
        <div className="w-full flex justify-end items-end">
          <button
            onClick={() => {
              clearall();
            }}
          >
            Clear Price
          </button>
        </div>
        <div className="flex flex-col justify-start w-full">
          <p className="text-lg font-semibold">Total Order Price:</p>
          <h1 className="flex w-full justify-center text-5xl text-red-600">
            {totalOrderPrice.toFixed(2)}
          </h1>
        </div>
      </div>

      <div className="flex-1 h-full overflow-auto border rounded-md px-4 bg-white shadow-md">
        <p className="text-xl text-gray-700 font-semibold mb-2 sticky top-0 bg-white z-10">
          Order Product List:
        </p>
        <div className="flex flex-col gap-2 mt-2">
          {orderlists.length > 0 ? (
            orderlists.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col mr-1 w-2/6">
                    <span className="font-semibold">{product.ProductName}</span>
                    <span className="text-sm text-gray-500">
                      Category: {product.CategoryType}
                    </span>
                    <span className="text-sm text-gray-500">
                      Amount: {product.Amount}
                    </span>
                  </div>
                  <div className="flex w-4/6 items-center">
                    <button
                      onClick={() => handleDecrement(product.ids.ProductId)}
                      className="font-bold text-4xl mx-2 cursor-pointer"
                      onMouseDown={() =>
                        handleLongPressStart(product.ids.ProductId)
                      }
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                    >
                      -
                    </button>
                    <input
                      value={
                        quantities[product.ids.ProductId] || product.orderQty
                      }
                      readOnly
                      className="text-4xl w-16 text-center border rounded-md"
                    />
                    <button
                      onClick={() => handleIncrement(product.ids.ProductId)}
                      className="font-bold text-4xl mx-2 cursor-pointer"
                    >
                      +
                    </button>
                    <div className="w-full flex justify-end text-red-600 font-bold text-4xl">
                      {productValue(
                        product,
                        quantities[product.ids.ProductId] || product.orderQty,
                        Number(product.Amount)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No products in the order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculations;
