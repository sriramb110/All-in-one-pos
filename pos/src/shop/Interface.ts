export interface CategoryInterface {
    name: string
    _id: string
}
export interface ProductInterface {
    buyprice: number
    inward: number
    categoryType: string
    amount: number
    productName: string
    stock:string
    _id: string
}
export interface Customer {
    customerName: string
    emailId: string
    phoneNumber: string
    _id: string
}

export interface ProductSelected {
  ProductName: string;
  CategoryType: string;
  Amount: string;
  orderQty:number;
  stock:number;
  ids: {
    CategoryId: string;
    ProductId: string;
  };
}

export interface Order {
  _id: string;
  Customerdata: Customer;
  payment: Payment;
  orderList: OrderItem[];
  totalPrice: number;
  orderId: string;
  Date: string;
  businessName: string;
}

export interface Payment {
  paymentMethod: string;
  discount: number;
  receivedPrice: number;
}

export interface OrderItem {
  ProductName: string;
  CategoryType: string;
  Amount: string;
  orderQty: number;
  ids: Ids;
}

export interface Ids {
  CategoryId: string;
  ProductId: string;
}

export interface LedgerResponse {
  ledger: Ledger;
  orderDetails: OrderDetail[];
  customerDetails: Customer;
  OSB:number;
}
export interface Ledger {
  _id: string;
  CustomerPhoneNumber: string;
  OrderId: string[];
  OSB: number;
  businessName: string;
  __v: number;
}
export interface OrderDetail {
  currentBalance: any
  orderPayment: Payment;
  orderDate: string;
  orderPrice: number;
  orderId: string;
}

interface StockInwardItem {
  id: string;
  buyprice: number;
  inward: number;
  productName: string;
}

export interface StockRecord {
  _id: string;
  AgencyName: string;
  Date: string;
  StockInward: StockInwardItem[];
  businessName: string;
  __v: number;
  totalInward: number;
  totalBuyPrice: number;
}

export interface ProductStock {
  ProductName: string;
  totalQty: number;
  totalAmount: string;
}
