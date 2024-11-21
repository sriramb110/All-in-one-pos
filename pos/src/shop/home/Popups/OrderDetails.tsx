import React, { useEffect, useState } from "react";
import { ProductSelected } from "../../Interface";

type Props = {
  orderList: ProductSelected[];
  ordersConfirm: () => void;
};

function OrderDetails({ orderList, ordersConfirm }: Props) {
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [productQty, setProductQty] = useState<number>(0);
  const [sortedOrderList, setSortedOrderList] = useState<ProductSelected[]>([]);

  useEffect(() => {
    const sortedList = [...orderList].sort((a, b) => {
      if (a.CategoryType < b.CategoryType) return -1;
      if (a.CategoryType > b.CategoryType) return 1;
      return 0;
    });
    setSortedOrderList(sortedList);
    orderDetails(sortedList);
  }, [orderList]);

  const orderDetails = (list: ProductSelected[]) => {
    let totalQuantity = 0;
    let totalCost = 0;

    list.forEach((item) => {
      totalQuantity += item.orderQty;
      totalCost += item.orderQty * parseFloat(item.Amount);
    });

    setTotalQty(totalQuantity);
    setTotalAmount(totalCost);
    setProductQty(list.length);
  };

  const totalValue = (Amount: number, Qty: number) => {
    return Amount * Qty;
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-4/6 h-5/6 bg-white border rounded-md shadow-md p-2 overflow-hidden">
        <div className="w-full h-26 flex justify-between pb-1 border-b-2">
          <div className="flex flex-col items-center font-semibold text-xl">
            <p>Total Order Qty</p>
            <p>{totalQty}</p>
          </div>
          <div className="flex flex-col items-center font-semibold text-xl">
            <p>Total Order Products</p>
            <p>{productQty}</p>
          </div>
          <div className="flex flex-col items-end font-semibold text-xl">
            <p>Order Price</p>
            <p className="text-red-600 text-s text-shadow-lg text-4xl">
              {totalAmount.toFixed(2)}{" "}
            </p>
          </div>
        </div>
        <div className="w-full h-4/5 overflow-auto p-2">
          <div className="flex w-full bg-neutral-300 static">
            <p className="w-16">s.no</p>
            <p className="w-full">Product Name(Category type)</p>
            <p className="w-20 flex justify-end">Price</p>
            <p className="w-20 flex justify-end">Qty</p>
            <p className="w-36 flex justify-end">Total Price</p>
          </div>
          {sortedOrderList.map((item, index) => (
            <div key={index} className="py-1 flex w-full border-b-2 p-1">
              <p className="w-16">{index + 1}</p>
              <p className="w-full">
                {item.ProductName} ({item.CategoryType})
              </p>
              <p className="w-20 flex justify-end">{item.Amount}</p>
              <p className="w-20 flex justify-end">{item.orderQty}</p>
              <p className="w-36 flex justify-end">
                {totalValue(Number(item.Amount), item.orderQty).toFixed(2)}{" "}
              </p>
            </div>
          ))}
          <div className="w-full px-2 border-t-2 flex justify-end">
            <button className="confirm" onClick={() => ordersConfirm()}>
              Order Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
