import React, { useEffect, useState } from "react";

type PaymentModeProps = {
  totalAmount: number;
  oldpaymentMode: any;
  paymentDetails: (data: any) => void;
  OSB:string;
};

function PaymentMode({
  totalAmount,
  paymentDetails,
  oldpaymentMode,
  OSB,
}: PaymentModeProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [reservedPrice, setReservedPrice] = useState<number>(0);

  useEffect(() => {
    if (oldpaymentMode) {
      setPaymentMethod(oldpaymentMode.paymentMethod);
      setDiscount(oldpaymentMode.discount);
      setReservedPrice(oldpaymentMode.reservedPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const discoundValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = e.target.value;
    if (/^\d*$/.test(inputNumber) && Number(inputNumber) <= totalAmount) {
      setDiscount(Number(inputNumber));
    }
  };

  const reservedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = Number(e.target.value);

    if (!isNaN(inputNumber) && inputNumber <= totalAmount - discount) {
      setReservedPrice(inputNumber);
    }
  };

  const paymentFineshed = () => {
    if (paymentMethod === "Cash") {
      const payment = {
        paymentMethod,
        discount,
        reservedPrice: reservedPrice,
        osb: totalAmount + Number(OSB) - discount - reservedPrice,
      };
      paymentDetails(payment);
    } else if (paymentMethod === "Card") {
      const payment = {
        paymentMethod,
        discount,
        reservedPrice: reservedPrice,
        osb: totalAmount + Number(OSB) - discount - reservedPrice,
      };
      paymentDetails(payment);
    } else if (paymentMethod === "Pay Later") {
      const payment = {
        paymentMethod,
        discount,
        reservedPrice: 0,
        osb: totalAmount + Number(OSB) - discount,
      };
      paymentDetails(payment);
    }
  };
  return (
    <div className="w-full flex justify-center h-auto">
      <div className="w-3/6 h-auto p-5 bg-white border rounded-md shadow-md">
        <div className="flex justify-around mb-4">
          <div className="flex">
            <input
              type="radio"
              name="pay"
              value="Pay Later"
              checked={paymentMethod === "Pay Later"}
              onChange={() => {
                setPaymentMethod("Pay Later");
                setDiscount(0);
                setReservedPrice(0);
              }}
            />
            <p className="mx-2">Later</p>
          </div>
          <div className="flex">
            <input
              type="radio"
              name="pay"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={() => {
                setPaymentMethod("Card");
                setDiscount(0);
                setReservedPrice(0);
              }}
            />
            <p className="mx-2">Card</p>
          </div>
          <div className="flex">
            <input
              type="radio"
              name="pay"
              value="Cash"
              checked={paymentMethod === "Cash"}
              onChange={() => {
                setPaymentMethod("Cash");
                setDiscount(0);
                setReservedPrice(0);
              }}
            />
            <p className="mx-2">Cash</p>
          </div>
        </div>
        {paymentMethod === "Cash" && (
          <div className="flex flex-col mt-3 px-4">
            <h1 className="text-xl font-semibold">Cash Payment Details</h1>
            <ul>
              <li className="flex justify-between mt-2">
                <p>Out standing Balance</p>
                <p>{Number(OSB).toFixed(2)} </p>
              </li>
              <li className="flex justify-between mt-2">
                <p>Total Price</p>
                <h1>{totalAmount.toFixed(2)} </h1>
              </li>
              <li className="flex justify-between mt-2">
                <p>Discount</p>
                <input
                  type="string"
                  className="border p-1 w-20 text-end"
                  value={discount}
                  onChange={discoundValue}
                />
              </li>
              <li className="flex justify-between mt-2">
                <p>Reserved Price</p>
                <input
                  type="string"
                  className="border p-1 w-20 text-end"
                  value={reservedPrice}
                  onChange={reservedValue}
                />
              </li>
              <li className="flex justify-between mt-2">
                <p>Remaining Price</p>
                <p>{(totalAmount - discount - reservedPrice).toFixed(2)} </p>
              </li>
            </ul>
            <div className="w-full mt-5 h-15 flex justify-center">
              <button
                className="cancel"
                onClick={() => {
                  setDiscount(0);
                  setReservedPrice(0);
                }}
              >
                Clear
              </button>
              <button
                className={` ${reservedPrice ? "confirm" : "confirm_dissable"}`}
                disabled={!reservedPrice}
                onClick={paymentFineshed}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {paymentMethod === "Card" && (
          <div className="flex flex-col mt-3 px-4">
            <h1 className="text-xl font-semibold">Card Payment Details</h1>
            <ul>
              <li className="flex justify-between mt-2">
                <p>Out standing Balance</p>
                <p>{Number(OSB).toFixed(2)} </p>
              </li>
              <li className="flex justify-between mt-2">
                <p>Total Price</p>
                <h1>{totalAmount}</h1>
              </li>
              <li className="flex justify-between mt-2">
                <p>Discount</p>
                <input
                  type="string"
                  className="border p-1 w-20 text-end"
                  value={discount}
                  onChange={discoundValue}
                />
              </li>
              <li className="flex justify-between mt-2">
                <p>Swip Price</p>
                <p>{totalAmount - discount}</p>
              </li>
            </ul>
            <div className="w-full mt-5 h-15 flex justify-center">
              <button
                className="cancel"
                onClick={() => {
                  setDiscount(0);
                  setReservedPrice(0);
                }}
              >
                Clear
              </button>
              <button className="confirm" onClick={paymentFineshed}>
                Next
              </button>
            </div>
          </div>
        )}
        {paymentMethod === "Pay Later" && (
          <div className="flex flex-col mt-3 px-4">
            <h1 className=" text-xl font-semibold">Pay Later Details</h1>
            <ul>
              <li className="flex justify-between mt-2">
                <p>Total Price</p>
                <h1>{totalAmount}</h1>
              </li>
              <li className="flex justify-between mt-2">
                <p>Discount</p>
                <input
                  type="string"
                  className="border p-1 w-20 text-end"
                  value={discount}
                  onChange={discoundValue}
                />
              </li>
              <li className="flex justify-between mt-2">
                <p>Old Out standing Balance</p>
                <p>{Number(OSB).toFixed(2)} </p>
              </li>
              <li className="flex justify-between mt-2">
                <p>New Out standing Balance</p>
                <p>{totalAmount+Number(OSB) - discount}</p>
              </li>
            </ul>
            <div className="w-full mt-5 h-15 flex justify-center">
              <button
                className="cancel"
                onClick={() => {
                  setDiscount(0);
                  setReservedPrice(0);
                }}
              >
                Clear
              </button>
              <button className="confirm" onClick={paymentFineshed}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentMode;
