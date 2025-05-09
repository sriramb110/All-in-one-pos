import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLedgerdata,
  patchledger,
  patchOrder,
} from "../../common_component/services";
import { LedgerResponse } from "../Interface";
import Loading from "../../common_component/Loading";

function CustomerLedgerDetails() {
  const { id } = useParams<{ id: string }>();
  const [ledger, setLedger] = useState<LedgerResponse>();
  const [receivedPrice, setReceivedPrice] = useState<number>(0);
  const [payMode, setPaymode] = useState<string>("");
  const [payosb, setPayosb] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [popup, setPopup] = useState<boolean>(false);

  useEffect(() => {
    getLedugerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLedugerDetails = () => {
    getLedgerdata(id)
      .then((res) => {
        const ledugerData: LedgerResponse = res.data;
        setLedger(ledugerData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const calculateBalances = () => {
    let runningBalance = 0;
    return ledger?.orderDetails.map((item, index) => {
      const perOrderBalance =
        item.orderPrice -
        (item.orderPayment.receivedPrice + item.orderPayment.discount);
      runningBalance += perOrderBalance;
      return { ...item, perOrderBalance, runningBalance };
    });
  };

  const ordersWithBalances = calculateBalances();

  const paying = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = Number(e.target.value);

    if (!isNaN(inputNumber) && inputNumber <= Number(ledger?.ledger.OSB)) {
      setReceivedPrice(inputNumber);
    }
  };

  const payments = () => {
    setLoading(true);
    const price = Number(ledger?.ledger.OSB) - receivedPrice;
    console.log(price)
    patchledger(id, price)
      .then((res) => {console.log(res); setPopup(!true);})
      .catch((error) => {
        console.log(error);
        setPopup(!true);
      });

    let priceS = receivedPrice;

    ledger?.orderDetails.map((order) => {
      const data = {
        orderPrice: order.orderPrice - order.orderPayment.discount,
        receivedPrice: order.orderPayment?.receivedPrice,
        balance: order.orderPrice - order.orderPayment.discount - order.orderPayment?.receivedPrice,
        discount: order.orderPayment.discount,
      };
      let pay = -data.balance + priceS;
      console.log(data.balance)
      setReceivedPrice(pay);
      console.log(priceS);
      if (priceS >= 0) {
        if (data.balance <= priceS && data.balance > 0) {
          const payment = {
            paymentMethod: payMode,
            discount: data.discount,
            receivedPrice: data.orderPrice ,
          };
          console.log(payment);
          priceS = priceS - data.orderPrice
          patchOrder(order.orderId, payment)
            .then((res) => console.log(res))
            .catch((error) => {
              console.log(error);
            });
        } else if (data.balance > priceS && priceS > 0 && data.balance > 0) {
          const payment = {
            paymentMethod: payMode,
            discount: data.discount,
            receivedPrice: data.receivedPrice+priceS,
          };
          console.log(payment);
          priceS = 0;
          patchOrder(order.orderId, payment)
            .then((res) => console.log(res))
            .catch((error) => {
              console.log(error);
            });
        }

      }

      getLedugerDetails();
      setReceivedPrice(0);
      setPayosb(false);
      setLoading(false);
    });
  };

  const clickdata = (index: any) => {
    const id = ledger?.ledger.OrderId[index];
    navigate(`/order/${id}`);
  };

  const popuptrue = () => {
    setPopup(true);
  };

  return (
    <div className="w-full h-full bg-slate-100 p-5 flex flex-row-reverse gap-2 pb-10 items-center">
      <div className="w-2/6 flex flex-col items-center h-full gap-2 sidebar">
        <div className="w-full border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
          <div>
            <h1 className="border-b-2 border-slate-800 mb-1">
              Out Standing Balance
            </h1>
            <p className="w-full h-full flex justify-end font-semibold text-6xl text-red-600 items-center">
              {Number(ledger?.ledger.OSB).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
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
        <div className="w-full border-4 rounded-2xl border-white shadow-inner p-2 m-1 bg-white">
          <div>
            <h1 className="border-b-2 border-slate-800 mb-1">
              Pay to Out Standing Balance
            </h1>
            {!payosb && (
              <div className="w-full h-20 flex justify-center font-semibold items-center">
                <button
                  className={` ${Number(ledger?.ledger.OSB) !== 0
                    ? "confirm"
                    : "confirm_dissable"
                    }`}
                  disabled={Number(ledger?.ledger.OSB) === 0}
                  onClick={() => setPayosb(true)}
                >
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
                      value={receivedPrice}
                      className="text-end border-2 rounded-lg px-2 w-24"
                    />
                  </div>
                  <div className=" w-full flex justify-between ">
                    <p>Balance Price</p>
                    <p>{Number(ledger?.ledger.OSB) - receivedPrice}</p>
                  </div>
                  <div className="w-full justify-center flex">
                    <button
                      className={` font-semibold ${receivedPrice ? "confirm" : "confirm_dissable"
                        }`}
                      onClick={payments}
                      disabled={!receivedPrice}
                    >
                      Confirm to pay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-8 border-white rounded-lg bg-white shadow-inner h-full p-2">
        <div className="w-full h-full flex flex-col rounded-lg">
          <div className="flex w-full justify-between">
            <h1>Orders List :</h1>
            <div className="w-1/2 justify-end h-10 flex gap-2 openpopup">
              <p>Out Standing Balance:</p>
              <h1>{Number(ledger?.ledger.OSB).toFixed(2)}</h1>
              <button
                className={` text-sm px-4 mb-1 rounded-full ${Number(ledger?.ledger.OSB) !== 0
                  ? "bg-blue-500 text-white"
                  : "bg-blue-300 text-white"
                  }`}
                disabled={Number(ledger?.ledger.OSB) === 0}
                onClick={popuptrue}
              >
                Pay OSB
              </button>
            </div>
          </div>
          <div className="w-full h-full pb-10 overflow-auto">
            <dl className="flex bg-slate-300 h-12 w-full p-1 px-2 gap-1 border-b-2 shadow font-semibold sticky top-0 z-2">
              <dt className="w-14 h-full flex justify-center overflow-hidden ">
                S.No
              </dt>
              <dt className="flex-1 h-full flex justify-start overflow-hidden">
                Order Id
              </dt>
              <dt className="flex-1 h-full flex justify-start overflow-hidden">
                Order Date
              </dt>
              <dt className="flex-1 h-full flex justify-end overflow-hidden">
                Order Price
              </dt>
              <dt className="flex-1 h-full flex justify-end overflow-hidden">
                Res. Price
              </dt>
              <dt className="flex-1 h-full flex justify-end  ">
                Order Balance
              </dt>
              <dt className="flex-1 h-full flex justify-end overflow-hidden ">
                Total Balance
              </dt>
            </dl>
            <div className="w-full flex flex-col flex-1">
              {ordersWithBalances?.map((item, index) => (
                <dl
                  onClick={() => clickdata(index)}
                  key={index}
                  className={`flex h-auto w-full p-1 px-2 border-b-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                >
                  <dt className="w-14 h-full flex justify-center overflow-hidden ">
                    {index + 1}
                  </dt>
                  <dt className="flex-1 h-full flex justify-start overflow-hidden">
                    {item.orderId}
                  </dt>
                  <dt className="flex-1 h-full flex justify-start overflow-hidden">
                    {item.orderDate}
                  </dt>
                  <dt className="flex-1 h-full flex justify-end overflow-hidden">
                    {item.orderPrice}
                  </dt>
                  <dt className="flex-1 h-full flex justify-end overflow-hidden">
                    {item.orderPayment.receivedPrice +
                      item.orderPayment.discount}
                  </dt>
                  <dt className="flex-1 h-full flex justify-end overflow-hidden">
                    {item.perOrderBalance.toFixed(2)}
                  </dt>
                  <dt className="flex-1 h-full flex justify-end overflow-hidden">
                    {item.runningBalance.toFixed(2)}
                  </dt>
                </dl>
              ))}
              {Number(ledger?.ledger.OSB) === 0 && (
                <div className="mt-5 w-full flex justify-center">
                  No ledger Balance
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {popup && (
        <div className="modalOrders">
          <div className="w-2/6 h-auto bg-white rounded-2xl p-2 flex flex-col items-center gap-2">
            <div className="w-full flex justify-end px-1">
              <p
                className=" font-semibold"
                onClick={() => {
                  setPopup(!true);
                  setPaymode("");
                  setReceivedPrice(0);
                }}
              >
                X
              </p>
            </div>
            <h1 className="-mt-6">OSB Payment</h1>
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
                    value={receivedPrice}
                    className="text-end border-2 rounded-lg px-2 w-24"
                  />
                </div>
                <div className=" w-full flex justify-between ">
                  <p>Balance Price</p>
                  <p>{Number(ledger?.ledger.OSB) - receivedPrice}</p>
                </div>
                <div className="w-full justify-center flex">
                  <button
                    className={` font-semibold ${receivedPrice ? "confirm" : "confirm_dissable"
                      }`}
                    onClick={payments}
                    disabled={!receivedPrice}
                  >
                    Confirm to pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerLedgerDetails;
