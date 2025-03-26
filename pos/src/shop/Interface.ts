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
  orderList: ProductSelected[];
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

export interface Profile {
  _id: string;
  username: string;
  name: string;
  dob: string;
  phoneNumber: string;
  businessName: string;
  emailId: string;
  addressLine1: string;
  addressLine2?: string;
  bio?: string;
  businessProfile: string;
  country: string;
  district: string;
  state: string;
  businessType: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  ownerName: string;
  registrationNumber: string;
}

export interface Profiles {
  name: string;
  phoneNumber: string;
  emailId: string;
  dob: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  district: string;
  country: string;
  businessName: string;
  bio?: string;
  businessProfile: string;
  businessType: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  ownerName: string;
  registrationNumber: string;
}

export interface MyProfiles{
  name: string;
  phoneNumber: string;
  emailId: string;
  dob: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  district: string;
  country: string;
}

export interface BusinessProfile {
  businessName: string;
  bio?: string;
  businessProfile: string;
  businessType: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  ownerName: string;
  registrationNumber: string;
}

export interface PersonalDetail {
  value: keyof Profiles;
  header: string;
  content: string;
  editable?: boolean;
}
interface OrderStats {
  orderCount: number;
  totalDiscount: number;
  totalProductSales: number;
  totalBalance: number;
}

export interface DashboardOrdersResponse {
  today: OrderStats;
  last7Days: OrderStats;
  last30Days: OrderStats;
}