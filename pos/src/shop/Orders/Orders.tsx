import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrdersid } from "../../common_component/services";
import { Order } from "../Interface";
import Loading from "../../common_component/Loading";

function Orders() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrder = async () => {
    try {
     const res = await getOrdersid(id);
     const orderDetails: Order = res.data.order;
     const sortedOrderList = orderDetails.orderList.sort((a, b) =>
       a.CategoryType.localeCompare(b.CategoryType)
     );
     setOrder({ ...orderDetails, orderList: sortedOrderList });
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Failed to load order details.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 p-2 pb-10 gap-2 justify-center items-start flex overflow-hidden">
      <div className="w-full flex bg-white border rounded-lg shadow-inner h-full p-2 overflow-hidden">
        <div className="w-full h-full">
          <h1>Orders List :</h1>
          <div className="w-full h-full pb-10 overflow-auto">
            <dl className="flex bg-slate-300 h-12 w-full p-1 px-2 border-b-2 shadow font-semibold sticky top-0 z-2">
              <dt className="w-14 h-full flex justify-center items-center ">
                S.No
              </dt>
              <dt className="w-3/6 h-full flex justify-start items-center">
                Product Name
              </dt>
              <dt className="w-2/6 h-full flex justify-start items-center">
                Category Type
              </dt>
              <dt className="w-10 h-full flex justify-end items-center">Qty</dt>
              <dt className="w-20 h-full flex justify-end items-center">
                Price
              </dt>
              <dt className="w-32 h-full flex justify-end items-center">
                Total Price
              </dt>
            </dl>
            <div className="w-full flex flex-col flex-1 ">
              {order.orderList.map((item, index) => (
                <dl
                  key={index} // Ensure a unique key for each row
                  className={`flex h-12 w-full p-1 px-2 border-b-2 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <dt className="w-14 h-full flex justify-center items-center">
                    {index + 1}
                  </dt>
                  <dt className="w-3/6 h-full flex justify-start items-center">
                    {item.ProductName}
                  </dt>
                  <dt className="w-2/6 h-full flex justify-start items-center">
                    {item.CategoryType}
                  </dt>
                  <dt className="w-10 h-full flex justify-end items-center">
                    {item.orderQty}
                  </dt>
                  <dt className="w-20 h-full flex justify-end items-center">
                    {Number(item.Amount).toFixed(2)}{" "}
                  </dt>
                  <dt className="w-32 h-full flex justify-end items-center">
                    {(item.orderQty * Number(item.Amount)).toFixed(2)}{" "}
                  </dt>
                </dl>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/6 max-w-96 flex flex-col p-2 gap-1 bg-white border rounded-lg shadow-lg h-auto">
        <div className="w-full h-1/6 bg-gray-100 p-4 border rounded-lg shadow-inner">
          <p className="font-bold text-xl">Order Price:</p>
          <h1 className="w-full flex justify-end text-5xl text-red-600">
            {order.totalPrice.toFixed(2)}{" "}
          </h1>
        </div>
        <div className="w-full bg-gray-100 p-2 border rounded-lg shadow-inner">
          <h1>Customer Details:</h1>
          <ul>
            <li>
              <p>Name:</p>
              <p>{order.Customerdata.customerName}</p>
            </li>
            <li>
              <p>Phone Number:</p>
              <p>{order.Customerdata.phoneNumber}</p>
            </li>
            <li>
              <p>Email ID:</p>
              <p>{order.Customerdata.emailId}</p>
            </li>
          </ul>
        </div>
        <div className="w-full bg-gray-100 p-2 border rounded-lg shadow-inner">
          <h1>Payment Details:</h1>
          <ul>
            <li>
              <p>Payment Method:</p>
              <p>{order.payment.paymentMethod}</p>
            </li>
            <li>
              <p>Discount:</p>
              <p>{order.payment.discount}</p>
            </li>
            <li>
              <p>Payment Amount:</p>
              <p>{order.payment.reservedPrice}</p>
            </li>
          </ul>
        </div>
        <div className="w-full bg-gray-100 p-2 border rounded-lg shadow-inner">
          <h1>Order Details:</h1>
          <ul>
            <li>
              <p>Date | Time:</p>
              <p>{order.Date_Time}</p>
            </li>
            <li>
              <p>Order Status:</p>
              <p></p>
            </li>
            <li>
              <p>Total Qty:</p>
              <p></p>
            </li>
            <li>
              <p>Total Products:</p>
              <p></p>
            </li>
          </ul>
        </div>
        <div className="w-full h-20 justify-center flex bg-gray-100 p-2 border items-center rounded-lg shadow-inner">
          <button
            className="px-6 h-10 bg-sky-700 text-white font-semibold rounded-full shadow-md 
             hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 
             focus:ring-offset-2 transform transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Reprint Bill
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;