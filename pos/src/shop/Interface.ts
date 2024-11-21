export interface CategoryInterface {
    name: string
    _id: string
}
export interface ProductInterface {
    categoryType: string
    amount: number
    productName: string
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
  orderQty:number
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
  Date_Time: string;
  businessName: string;
}

export interface Payment {
  paymentMethod: string;
  discount: number;
  reservedPrice: number;
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
