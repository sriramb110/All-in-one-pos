import React, { useRef } from "react";

const ThermalPrinterTest = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open("", "_blank");

    if (windowPrint && printContent) {
      windowPrint.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: monospace;
                margin: 0;
                padding: 0;
              }
              .receipt {
                width: 80mm;
                padding: 10px;
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      windowPrint.close();
    }
  };

  return (
    <div>
      <div ref={printRef} className="receipt">
        <h3>Receipt</h3>
        <p>Item 1: $10</p>
        <p>Item 2: $15</p>
        <hr />
        <p>Total: $25</p>
        <p>Thank you for shopping!</p>
      </div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default ThermalPrinterTest;
