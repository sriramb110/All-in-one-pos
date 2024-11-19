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
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (orderProducts && orderProducts.ids) {
      const isProductExists = orderlists.some(
        (item) => item.ids.ProductId === orderProducts.ids.ProductId
      );

      if (!isProductExists) {
        setOrderlists((prevList) => [
          ...prevList,
          { ...orderProducts, orderQty: orderProducts.orderQty || 1 },
        ]);
      } else {
        setOrderlists((prevList) =>
          prevList.map((item) =>
            item.ids.ProductId === orderProducts.ids.ProductId
              ? { ...item, orderQty: (item.orderQty || 1) + 1 }
              : item
          )
        );
      }
    }

    if (allProduct) {
      setOrderlists([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderProducts, allProduct]);

  useEffect(() => {
    listOfProducts(orderlists);
  }, [orderlists, listOfProducts]);

  const handleIncrement = (productId: string) => {
    setOrderlists((prevList) =>
      prevList.map((item) =>
        item.ids.ProductId === productId
          ? { ...item, orderQty: Math.min((item.orderQty || 1) + 1, 99) }
          : item
      )
    );
  };

  const handleDecrement = (productId: string) => {
    setOrderlists((prevList) =>
      prevList.reduce<ProductSelected[]>((acc, item) => {
        if (item.ids.ProductId === productId) {
          const newQty = (item.orderQty || 1) - 1;
          if (newQty > 0) {
            acc.push({ ...item, orderQty: newQty });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const handleLongPressStart = (productId: string) => {
    longPressTimer.current = setTimeout(() => {
      setOrderlists((prevList) =>
        prevList.filter((item) => item.ids.ProductId !== productId)
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
    const quantity = item.orderQty || 1;
    return acc + amount * quantity;
  }, 0);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-2">
      <div className="w-full h-1/6 border rounded-md p-2 flex justify-center items-center flex-col bg-white shadow-md">
        <div className="w-full flex justify-between">
          <p className="text-lg font-semibold">Total Order Price:</p>
          <button onClick={clearall} className="text-red-600 font-bold">
            Clear Price
          </button>
        </div>
        <h1 className="text-5xl text-red-600 text-center">
          {totalOrderPrice.toFixed(2)}
        </h1>
      </div>

      <div className="flex-1 overflow-auto border rounded-md p-4 bg-white shadow-md">
        <p className="text-xl font-semibold mb-2 sticky top-0 bg-white z-10">
          Order Product List:
        </p>
        <div className="flex flex-col gap-2">
          {orderlists.length > 0 ? (
            orderlists.map((product) => (
              <div
                key={product.ids.ProductId}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex flex-col w-2/6">
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
                    onMouseDown={() =>
                      handleLongPressStart(product.ids.ProductId)
                    }
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    className="text-4xl mx-2 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    value={product.orderQty || 1}
                    readOnly
                    className="text-4xl w-16 text-center border rounded-md"
                  />
                  <button
                    onClick={() => handleIncrement(product.ids.ProductId)}
                    className="text-4xl mx-2 cursor-pointer"
                  >
                    +
                  </button>
                  <div className="ml-auto text-4xl text-red-600">
                    {(product.orderQty || 1) * Number(product.Amount)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No products in the order
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculations;
