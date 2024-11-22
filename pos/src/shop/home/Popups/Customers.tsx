import React, { useEffect, useState } from "react";
import { Customer } from "../../Interface";
import { TextField } from "@mui/material";
import { postCustomer, osbLedger } from "../../../common_component/services";

type Props = {
  customer: Customer[];
  nextStep: (updateData: any) => void;
  Refresh: () => void;
  Avabiles: any;
  closeCustomer: () => void;
  OSB: (numbrt: string) => void;
  obss:string;
};

function Customers({
  customer,
  nextStep,
  Refresh,
  Avabiles,
  closeCustomer,
  OSB,
  obss,
}: Props) {
  const [input, setInput] = useState({
    Name: "",
    PhoneNumber: "",
    EmailId: "",
  });
  const [addContact, setAddContact] = useState<boolean>(true);
  const [osb, setOsb] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (Avabiles) {
      setInput({
        Name: Avabiles.customerName,
        PhoneNumber: Avabiles.phoneNumber,
        EmailId: Avabiles.emailId,
      });
      setOsb(obss);
    }
  }, [Avabiles]);

  const clearData = () => {
    setInput({
      Name: "",
      PhoneNumber: "",
      EmailId: "",
    });
    setAddContact(true);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNumber = e.target.value;

    if (/^\d*$/.test(inputNumber) && inputNumber.length <= 10) {
      setInput((prevInput) => ({ ...prevInput, PhoneNumber: inputNumber }));

      if (inputNumber.length === 10) {
        const foundCustomer = customer.filter(
          (c) => c.phoneNumber === inputNumber
        )[0];

        if (foundCustomer) {
          setLoading(true);
          osbLedger(inputNumber)
            .then((res) => {
              setOsb(res.data.ledger);
              OSB(res.data.ledger);
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              setOsb("0");
              OSB("0");
            });
          setInput({
            Name: foundCustomer.customerName,
            PhoneNumber: foundCustomer.phoneNumber,
            EmailId: foundCustomer.emailId,
          });
          setAddContact(true);
        } else {
          setInput({
            PhoneNumber: inputNumber,
            Name: "",
            EmailId: "",
          });
          setAddContact(false);
          setOsb("0");
          OSB("0");
        }
      } else {
        setOsb("0");
        OSB("0");
        setInput({
          PhoneNumber: inputNumber,
          Name: "",
          EmailId: "",
        });
        setAddContact(true);
      }
    }
  };

  const submit = async () => {
    const foundCustomer = customer.filter(
      (c) => c.phoneNumber === input.PhoneNumber
    )[0];
    if (!foundCustomer && input) {
      try {
        const response = await postCustomer(input);
        const responseData = response.data.customer;
        const updateData = {
          customerName: responseData.customerName,
          phoneNumber: responseData.phoneNumber,
          emailId: responseData.emailId,
          _id: responseData._id,
        };
        nextStep(updateData);
        Refresh();
        clearData();
      } catch (error) {
        console.error("Failed to add customer:", error);
      }
    } else {
      nextStep(foundCustomer);
    }
  };

  return (
    <div className="w-full flex justify-center h-auto">
      <div className="w-auto bg-white border rounded-md shadow-md">
        {Avabiles && (
          <div className="w-full flex justify-end">
            <p
              className="mx-1 cursor-pointer hover:border-blue-100 text-red-600 font-bold"
              onClick={() => closeCustomer()}
            >
              X
            </p>
          </div>
        )}
        <div className="flex flex-col m-5">
          <TextField
            type="text"
            placeholder="Phone Number"
            className="mt-3 border-2 w-96 pl-10 h-20 rounded-lg"
            onChange={handlePhoneNumberChange}
            value={input.PhoneNumber}
          />

          <TextField
            type="text"
            placeholder="Customer Name"
            className="mt-3 border-2 w-96 pl-10 h-20 rounded-lg"
            value={input.Name}
            disabled={addContact}
            onChange={(e) => setInput({ ...input, Name: e.target.value })}
          />

          <TextField
            type="email"
            placeholder="Customer Email"
            className="mt-3 border-2 w-96 pl-10 h-20 rounded-lg"
            value={input.EmailId}
            onChange={(e) => setInput({ ...input, EmailId: e.target.value })}
            disabled={addContact}
          />

          <div className="flex w-full justify-between font-semibold text-2xl">
            <p>Out Standing Balance</p>
            {loading ? (
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-400"></div>
              </div>
            ) : (
              <p className="text-red-700">{Number(osb).toFixed(2)} </p>
            )}
          </div>

          <div className="w-full flex justify-center gap-2 mt-4">
            <button
              className="cancel bg-gray-200 px-4 py-2 rounded-md"
              onClick={clearData}
            >
              Clear
            </button>
            <button
              className={` px-4 py-2 rounded-md ${
                input.Name && input.PhoneNumber.length === 10
                  ? "confirm"
                  : "confirm_dissable"
              }`}
              onClick={submit}
              disabled={!input.Name || input.PhoneNumber.length !== 10}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
