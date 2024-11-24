import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLedgerdata } from "../../common_component/services";
import { LedgerResponse } from "../Interface";

function CustomerLedgerDetails() {
  const { id } = useParams<{ id: string }>();
  const [ledger, setLedger] = useState<LedgerResponse>();
  const [reservedPrice, setReservedPrice] = useState<number>(0);
  const [payMode, setPaymode] = useState<string>("");
  const [payosb,setPayosb]=useState<boolean>(false);

  useEffect(() => {
    getLedugerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLedugerDetails = () => {
    getLedgerdata(id)
      .then((res) => {
        const ledugerData: LedgerResponse = res.data;
        setLedger(ledugerData);
      })
      .catch(() => {});
  };

  const calculateBalances = () => {
    let runningBalance = 0;
    return ledger?.orderDetails.map((item, index) => {
      const perOrderBalance = item.orderPrice - item.orderPayment.reservedPrice;
      runningBalance += perOrderBalance;
      return { ...item, perOrderBalance, runningBalance };
    });
  };

  const ordersWithBalances = calculateBalances();

  const paying = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = Number(e.target.value);

    if (!isNaN(inputNumber) && inputNumber <= Number(ledger?.ledger.OSB)) {
      setReservedPrice(inputNumber);
    }
  };

  return (
    <div className="w-full h-full bg-slate-100 p-5 flex flex-row-reverse gap-2 pb-10 items-center">
      <div className="w-auto flex flex-col items-center h-full gap-2">
        <div className="w-96 border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
          <div>
            <h1 className="border-b-2 border-slate-800 mb-1">
              Out Standing Balance
            </h1>
            <p className="w-full h-full flex justify-end font-semibold text-6xl text-red-600 items-center">
              {Number(ledger?.ledger.OSB).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-96 border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
          <ul>
            <h1 className="border-b-2 border-slate-800 mb-1">
              Customer Details
            </h1>
            <li>
              <p>Name</p>
              <p>{ledger?.customerDetails.customerName}</p>
            </li>
            <li>
              <p>Phone Number</p>
              <p>{ledger?.customerDetails.phoneNumber}</p>
            </li>
            <li>
              <p>Email Id</p>
              <p>{ledger?.customerDetails.emailId}</p>
            </li>
          </ul>
        </div>
        <div className="w-96 border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
          <div>
            <h1 className="border-b-2 border-slate-800 mb-1">
              Pay to Out Standing Balance
            </h1>
            {!payosb && (
              <div className="w-full h-20 flex justify-center font-semibold items-center">
                <button className="confirm" onClick={() => setPayosb(true)}>
                  Pay OSB
                </button>
              </div>
            )}
          </div>
          {payosb && (
            <div className="w-full h-auto flex flex-col justify-center gap-1 items-center">
              <div className="flex gap-11">
                <div className="flex">
                  <input
                    type="radio"
                    name="pay"
                    onChange={() => setPaymode("Card")}
                  />
                  <p>Card</p>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    name="pay"
                    onChange={() => setPaymode("Card")}
                  />
                  <p>Cash</p>
                </div>
              </div>
              {payMode && (
                <div className="w-full gap-2 flex flex-col">
                  <div className=" w-full flex justify-between ">
                    <p>Received Price</p>
                    <input
                      type="text"
                      name="amount"
                      placeholder="Pay Amount"
                      onChange={paying}
                      value={reservedPrice}
                      className="text-end border-2 rounded-lg px-2 w-24"
                    />
                  </div>
                  <div className=" w-full flex justify-between ">
                    <p>Balance Price</p>
                    <p>{Number(ledger?.ledger.OSB) - reservedPrice}</p>
                  </div>
                  <div className="w-full justify-center flex">
                    <button className="confirm font-semibold">
                      Confirm to pay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-5/6 border-8 border-white rounded-lg bg-white shadow-inner h-full p-2">
        <div className="w-full h-full flex flex-col rounded-lg">
          <h1>Orders List :</h1>
          <div className="w-full h-full pb-10 overflow-auto">
            <dl className="flex bg-slate-300 h-12 w-full p-1 px-2 gap-1 border-b-2 shadow font-semibold sticky top-0 z-2">
              <dt className="w-14 h-full flex justify-center items-center ">
                S.No
              </dt>
              <dt className="w-1/6 h-full flex justify-start items-center">
                Order Id
              </dt>
              <dt className="w-1/6 h-full flex justify-start items-center">
                Order Date
              </dt>
              <dt className="w-1/6 h-full flex justify-end items-center">
                Order Price
              </dt>
              <dt className="w-1/6 h-full flex justify-end items-center">
                Res. Price
              </dt>
              <dt className="w-1/6 h-full flex justify-end items-center">
                Order Balance
              </dt>
              <dt className="w-1/6 h-full flex justify-end items-center">
                Total balance Balance
              </dt>
            </dl>
            <div className="w-full flex flex-col flex-1">
              {ordersWithBalances?.map((item, index) => (
                <dl
                  key={index}
                  className={`flex h-12 w-full p-1 px-2 border-b-2 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <dt className="w-14 h-full flex justify-center items-center">
                    {index + 1}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-start items-center">
                    {item.orderId}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-start items-center">
                    {item.orderDate}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-end items-center">
                    {item.orderPrice}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-end items-center">
                    {item.orderPayment.reservedPrice}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-end items-center">
                    {item.perOrderBalance.toFixed(2)}
                  </dt>
                  <dt className="w-1/6 h-full flex justify-end items-center">
                    {item.runningBalance.toFixed(2)}
                  </dt>
                </dl>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLedgerDetails;