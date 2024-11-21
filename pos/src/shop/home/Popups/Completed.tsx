import React, { useEffect, useState } from "react";
import { Customer, ProductSelected } from "../../Interface";
import { postOrders } from "../../../common_component/services";

type Props = {
  Customerdata: Customer | any;
  payment: any;
  orderList: ProductSelected[];
  totalAmount: number;
  ordersuccess: () => void;
  goToHome:()=>void;
};

function Completed({
  Customerdata,
  payment,
  orderList,
  totalAmount,
  ordersuccess,
  goToHome,
}: Props) {
  const [responceSuccess, setResponceSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    postorder();
  }, []);

  const postorder = () => {
    const now = new Date();
    const dateorder = `${now.toLocaleDateString()} | ${now.toLocaleTimeString()}`;
    const OrdersId = `${now.getTime()}`;
    setDate(dateorder);
    setOrderId(OrdersId);

    postOrders(
      Customerdata,
      payment,
      orderList,
      totalAmount,
      OrdersId,
      dateorder
    )
      .then((res) => {
        ordersuccess();
        setResponceSuccess(true);
      })
      .catch((error) => {});
  };
  return (
    <div className="w-full flex justify-center h-auto overflow-hidden">
      <div className="w-auto bg-white border rounded-md shadow-md">
        {responceSuccess ? (
          <div className="w-96 h-auto m-2 flex flex-col justify-center items-center bg-gray-100">
            <h1>Your Order has plased Success</h1>
            <ul className="flex flex-col h-5/6 w-full p-5 ">
              <li className="flex w-full justify-between my-2 ">
                <p>Order Id</p>
                <p>{orderId}</p>
              </li>
              <li className="flex w-full justify-between my-2">
                <p>Order Date / Time</p>
                <p>{date}</p>
              </li>
              <li className="flex w-full justify-between my-2">
                <p>Order Price</p>
                <p>{totalAmount}</p>
              </li>
            </ul>
            <div>
              <button
                className="w-full flex justify-center confirm"
                onClick={() => goToHome()}
              >
                Make New Order
              </button>
            </div>
          </div>
        ) : (
          <div className="w-96 h-96 flex flex-col justify-center items-center bg-gray-100">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-400"></div>
            </div>
            <p className="text-gray-700 font-semibold text-center animate-pulse">
              Please Wait, your Order has Processing...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completed;
