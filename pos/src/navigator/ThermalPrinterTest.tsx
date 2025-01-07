import React from "react";
import { Customer, ProductSelected } from "../shop/Interface";

interface ThermalPrinterTestProps {
  Customerdata: Customer;
  payment: any;
  orderList: ProductSelected[];
  totalAmount: number;
  orderId: string;
  osb:any
}

const ThermalPrinterTest: React.FC<ThermalPrinterTestProps> = ({
  Customerdata,
  payment,
  orderList,
  totalAmount,
  orderId,
  osb
}) => {
  const shopName = `SRI SHOP`;  

  const generateOrderList = () => {
    return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 5px; width: 10%;">S.No</th>
          <th style="border: 1px solid black; padding: 5px; width: 30%;">Product Name</th>
          <th style="border: 1px solid black; padding: 5px; width: 10%;">Price(₹)</th>
          <th style="border: 1px solid black; padding: 5px; width: 10%;">Qty</th>
          <th style="border: 1px solid black; padding: 5px; width: 20%;">Total(₹)</th>
        </tr>
      </thead>
      <tbody>
        ${orderList
        .map(
          (item, index) => `
              <tr>
                <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
                <td style="border: 1px solid black; padding: 5px;">${item.ProductName} </br> (${item.CategoryType})</td>
                <td style="border: 1px solid black; padding: 5px;">${Number(item.Amount).toFixed(2)}</td>
                <td style="border: 1px solid black; padding: 5px;">${item.orderQty}</td>
                <td style="border: 1px solid black; padding: 5px; text-align: right">${(Number(item.Amount) * item.orderQty).toFixed(2)}</td>
              </tr>
            `
        )
        .join("")}
      </tbody>
    </table>
  `;
  };

  const customerDetails = () => {
    return `
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="width: 50%;">
          <h3>Customer Details</h3>
          <p>Name: ${Customerdata.customerName}</p>
          <p>Phone: ${Customerdata.phoneNumber}</p>
          <p>Email: ${Customerdata.emailId || 'N/A'}</p>
        </td>
        <td style="width: 50%;  margin: 1px">
          <h3>Order Details</h3>
          <p>Order ID: ${orderId}</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Paymant Method: <b>${payment?.paymentMethod}</b></p>
        </td>
      </tr>
    </table>
  `;
  };

  const payMent = () => {
    return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tbody style="padding: 5px;">
        <tr>
          <td style="width: 80%;  text-align: left;">
            <b>Total Price</b>
          </td>
          <td style="width: 20%;  text-align: right;">
            <b>₹${totalAmount.toFixed(2)}</b>
          </td>
        </tr>
        <tr>
          <td style="width: 80%; text-align: left;">
            <b>Discount</b>
          </td>
          <td style="width: 20%; text-align: right;">
            <b>₹${(payment?.discount || 0).toFixed(2)}</b>
          </td>
        </tr>
        <tr>
          <td style="width: 80%; text-align: left;">
            <b>Reserved Price</b>
          </td>
          <td style="width: 20%; text-align: right;">
            <b>₹${(payment?.reservedPrice || 0).toFixed(2)}</b>
          </td>
        </tr>
        <tr>
          <td style="width: 80%; text-align: left;">
            <b>Balance</b>
          </td>
          <td style="width: 20%; text-align: right;">
            <b>₹${(totalAmount - payment?.discount - payment?.reservedPrice).toFixed(2)}</b>
          </td>
        </tr>
        <tr>
          <td style="width: 80%; text-align: left;">
            <b>Total OSB</b>
          </td>
          <td style="width: 20%; text-align: right;">
            <b>₹${(totalAmount - payment?.discount - payment?.reservedPrice + Number(osb)).toFixed(2)}</b>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  };



  const content = `
    <div style="font-family: 'Courier New', Courier, monospace; padding-top: 20px; padding : 2px; ">
      <h1 style="text-align: center;">${shopName}</h1>
      ${customerDetails()}
      ${generateOrderList()}
      ${payMent()}
      <p style="text-align: center; margin-top: 20px;">Thank you for your purchase!</p>
    </div>
  `;

  const handlePrint = () => {
    const printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.width = "0";
    printWindow.style.height = "0";
    printWindow.style.border = "none";
    document.body.appendChild(printWindow);

    const printDoc = printWindow.contentWindow?.document;

    if (printDoc) {
      printDoc.open();
      printDoc.write(`
      <html>
        <head>
          <style>
            @media print {
              body {
                font-size: 14px;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
      printDoc.close();

      printWindow.onload = () => {
        try {
          printWindow.contentWindow?.focus();
          printWindow.contentWindow?.print();
        } catch (error) {
          console.error("Error triggering print:", error);
        }
        setTimeout(() => document.body.removeChild(printWindow), 1000);
      };
    } else {
      console.error("Failed to access iframe content document.");
    }
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        className="w-full flex justify-center confirm"
      >
        Print respite
      </button>
    </div>
  );
};

export default ThermalPrinterTest;
