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
    phoneNumber: number
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