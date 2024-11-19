import React, { useEffect, useState } from "react";
import { Customer, ProductSelected } from "../Interface";
import Customers from "./Popups/Customers";
import OrderDetails from "./Popups/OrderDetails";
import PaymentMode from "./Popups/PaymentMode";
import Completed from "./Popups/Completed";

type confirmData = {
  orderList: ProductSelected[];
  customer: Customer[];
  refresh: () => void;
};

function Orderspopup({ orderList, customer, refresh }: confirmData) {
  const [popupHeaders, setPopupheaders] =
    useState<string>("Customer Selection");
  const [selectCustomer, setSelectCus] = useState<Customer>();
  const [billVerfy, setBillVerfy] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<any>();
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [customerDetails, setCustomerDetails] = useState<boolean>(true);
  const [orderCheck, setOrderCheck] = useState<boolean>(false);
  const [paymentCheck, setPaymentCheck] = useState<boolean>(false);

  useEffect(() => {
    orderDetails();
  }, []);

  const orderDetails = () => {
    let totalQuantity = 0;
    let totalCost = 0;
    orderList.forEach((item) => {
      totalQuantity += item.orderQty;
      totalCost += item.orderQty * parseFloat(item.Amount);
    });
    setTotalQty(totalQuantity);
    setTotalAmount(totalCost);
  };

  const customerComplated = (customerData: Customer) => {
    setSelectCus(customerData);
    setCustomerDetails(false);
    setOrderCheck(true);
    setPopupheaders("Prive Order Details");
  };

  const closeCustomer = () => {
    setCustomerDetails(false);
  };

  const nextdata = () => {
    console.log("object");
    setBillVerfy(true);
    setOrderCheck(false);
    setPopupheaders("Payment Methods");
    setPaymentCheck(true);
  };

  const payment = (data:any) => {
    setPopupheaders("Waiting for conformation");
    setPaymentMode(data);
    setPaymentCheck(false);
  };

  const billdata =()=>{
    setPaymentCheck(false);
    setCustomerDetails(false);
    setOrderCheck(true);
  }

  const payview =()=>{
    setPaymentCheck(true);
    setCustomerDetails(false);
    setOrderCheck(false);
  }

  return (
    <div className="w-5/6 h-5/6 gro -mt-5 ">
      <div className="w-full flex justify-center ">
        <button className="bg-red-500 text-white font-semibold py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all">
          Cancel Orders
        </button>
       <h1
  className={`font-serif mx-5 text-2xl text-shadow-lg p-4 border rounded-md shadow-md ${
    popupHeaders === "Waiting for conformation"
      ? "bg-orange-500 text-white"
      : popupHeaders === "Confirm"
      ? "bg-green-500 text-white"
      : "bg-white text-black"
  }`}
>
  {popupHeaders}
</h1>
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all">
          Add Products
        </button>
      </div>
      <div className=" w-full h-full flex">
        <div className="w-2/6 flex flex-col items-center">
          <h1 className="font-serif text-2xl text-shadow-lg w-full mb-2 bg-white p-4 border rounded-md shadow-md">
            Completed Steps:
          </h1>
          {selectCustomer && !customerDetails && (
            <div
              className="w-5/6 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer"
              onClick={() => {
                setCustomerDetails(true);
                setOrderCheck(false);
                setPaymentCheck(false);
              }}
            >
              <p className="-ml-2 -mt-1 font-semibold mb-1">
                Customer details:
              </p>
              <div className="flex border-b-2 w-full justify-between">
                <p className="w-20">Customer Name</p>
                <p>{selectCustomer.customerName}</p>
              </div>
              <div className="flex w-full justify-between">
                <p className="w-20">Phone Number</p>
                <p>{selectCustomer.phoneNumber}</p>
              </div>
            </div>
          )}
          {!orderCheck && billVerfy && (
            <div
              className="w-5/6 mt-1 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer"
              onClick={billdata}
            >
              <p className="-ml-2 -mt-1 font-semibold">Order Details:</p>
              <div className="flex border-b-2 w-full justify-between">
                <p>Total Price</p>
                <p className="font-semibold text-3xl text-red-600">
                  {totalAmount}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p>Total Qty</p>
                <p>{totalQty}</p>
              </div>
            </div>
          )}
          {paymentMode && !paymentCheck && (
            <div
              className="w-5/6 mt-1 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer"
              onClick={payview}
            >
              <p className="-ml-2 -mt-1 font-semibold">Payment Details:</p>
              <div className="flex border-b-2 w-full justify-between">
                <p>Payment Mode</p>
                <p>{paymentMode.paymentMethod}</p>
              </div>
              <div className="flex border-b-2 w-full justify-between">
                <p>Discount Price</p>
                <p>{paymentMode.discount}</p>
              </div>
              <div className="flex border-b-2 w-full justify-between">
                <p>Resved Price</p>
                <p>{paymentMode.reservedPrice}</p>
              </div>
              <div className="flex  w-full justify-between">
                <p>Balance price</p>
                <p>
                  {totalAmount -
                    paymentMode.discount -
                    paymentMode.reservedPrice}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="w-full p-5 ">
          {customerDetails && (
            <Customers
              customer={customer}
              nextStep={customerComplated}
              Refresh={refresh}
              Avabiles={selectCustomer}
              closeCustomer={closeCustomer}
            />
          )}
          {orderCheck && (
            <OrderDetails orderList={orderList} ordersConfirm={nextdata} />
          )}
          {paymentCheck && (
            <PaymentMode
              totalAmount={totalAmount}
              paymentDetails={payment}
              oldpaymentMode={paymentMode}
            />
          )}
          <Completed />
        </div>
        <div className="w-2/6 flex flex-col items-center ">
          <h1 className="font-serif mb-2 w-full text-2xl text-shadow-lg bg-white p-4 border rounded-md shadow-md">
            Waiting Steps:
          </h1>
          {!orderCheck && !billVerfy && (
            <div className="w-5/6 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer">
              <p className="-ml-2 -mt-1 font-semibold">Order Details:</p>
              <div className="flex border-b-2 w-full justify-between">
                <p>Total Price</p>
                <p className="font-semibold text-3xl text-red-600">
                  {totalAmount}
                </p>
              </div>
              <div className="flex w-full justify-between">
                <p>Total Qty</p>
                <p>{totalQty}</p>
              </div>
            </div>
          )}
          {!paymentMode && !paymentCheck && (
            <div className="w-5/6 mt-1 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer">
              <p className="-ml-2 -mt-1 font-semibold">Payment Details:</p>
              <div className="flex border-b-2 w-full justify-between">
                <p>Payment Mode</p>
                <p>Card/Cash</p>
              </div>
              <div className="flex border-b-2 w-full justify-between">
                <p>Resved Price</p>
                <p>0</p>
              </div>
              <div className="flex  w-full justify-between">
                <p>Balance price</p>
                <p>-</p>
              </div>
            </div>
          )}
          <div className="w-5/6 mt-1 bg-white p-4 border rounded-md shadow-md h-auto cursor-pointer font-semibold">
            Final Step
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orderspopup;
