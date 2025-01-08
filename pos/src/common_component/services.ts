import api from '../axios';

export const signupUser = async (formData: any) => {
  try {
    const response = await api.post('/signup', {
      username: formData.username,
      name: formData.name,
      dob: formData.dob,
      phoneNumber: formData.phoneNumber,
      businessName: formData.businessName,
      emailId: formData.emailId
    });
    return response;
  } catch (error) {
    // console.error("Signup error:", error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/signin', {
      username: username,
      password: password
    });
    return response;
  } catch (error) {
    // console.error("Login error:", error);
    throw error;
  }
};

export const confirmPassword = async (token: any, password: string) => {
  try {
    const response = await api.patch(`/signup/set-password/${token}`, {
      password: password
    });
    return response;
  } catch (error) {
    // console.error("Password confirmation error:", error);
    throw error;
  }
};

export const category = async () => {
  try {
    const response = await api.get(`/categories`);
    return response;
  } catch (error) {
    // console.error("Error fetching categories:", error);
    throw error;
  }
};

export const product = async () => {
  try {
    const response = await api.get(`/products`);
    return response;
  } catch (error) {
    // console.error("Error fetching products:", error);
    throw error;
  }
};

export const postProduct = async (input: any) => {
  try {
    const response = await api.post(`/products`, {
      categoryType: input.categoryName,
      productName: input.productName,
      amount: input.amount,
      stock:0
    });
    return response;
  } catch (error) {
    // console.error("Error posting product:", error);
    throw error;
  }
};

export const postCategory = async (input: any) => {
  try {
    const response = await api.post(`/categories`, {
      name: input.categoryName,
    });
    console.log("Category posted successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error posting category data:", error);
    throw error;
  }
};

export const deleteProduct = async (id: any[]) => {
  try {
    const response = await api.delete(`/products`, {
      data: { "ids": id }
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/categories/${id}`)
    return response;
  } catch (error) {
    console.error("Error posting category data:", error);
    throw error;
  }
}

export const editCategory = async (id: string, categoryName: string) => {
  try {
    const response = await api.put(`/categories/${id}`, {
      name: categoryName
    })
    return response;
  } catch (error) {
    console.error("Error posting category data:", error);
    throw error;
  }
}

export const editProduct = async (input: any, id: string) => {
  try {
    const response = await api.put(`/products/${id}`, {
      categoryType: input.categoryName,
      productName: input.productName,
      amount: Number(input.amount),
      stock:0
    });
    return response;
  } catch (error) {
    // console.error("Error posting product:", error);
    throw error;
  }
};

export const getCustomer = async () => {
  try {
    const response = await api.get(`/customer`)
    return response;
  } catch (error) {
    throw error;
  }
}

export const postCustomer = async(input:any)=>{
  try{
    const response = await api.post(`/customer`,{
    customerName:input.Name,
    phoneNumber:input.PhoneNumber,
    emailId:input.EmailId
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteCustomer = async(ids:any[])=>{
  try{
    const response = await api.delete(`/customer`,{
    data:{ids:ids}
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export const editCustomer = async(input:any)=>{
  
  try{
    const response = await api.put(`/customer/${input.id}`,{
    customerName:input.Name,
    phoneNumber:input.PhoneNumber,
    emailId:input.EmailId
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export const postOrders = async (
  Customerdata: any,
  payment: any,
  orderList: any,
  totalPrice:number,
  orderId:string,
  Date_Time:string
) => {
  try {
    const response = await api.post(`/order`, {
      Customerdata,
      payment,
      orderList,
      Date_Time,
      orderId,
      totalPrice,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async ()=>{
  try {
    const response = await api.get(`/order`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrdersid = async (id:any) => {
  try {
    const response = await api.get(`/order/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postLedger = async (CustomerPhoneNumber: string, OrderId:string,OSB:string)=>{
  try {
    const response = await api.post(`/ledger`, {
      CustomerPhoneNumber,
      OrderId,
      OSB
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const osbLedger = async (CustomerPhoneNumber: string)=>{
  try {
    const response = await api.get(`/ledger/osb/${CustomerPhoneNumber}`)
    return response;
  } catch (error) {
    throw error;
  }
}

export const getLedger = async()=>{
  try {
    const response = await api.get(`/ledger`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getLedgerdata = async(number:any)=>{
  try{
      const response = await api.get(`/ledger/${number}`)
    return response;
  } catch (error) {
    throw error;
  }
}

export const patchOrder = async (id: any, payment:any) => {
  try {
    const response = await api.patch(`/order/${id}`, { payment });
    return response;
  } catch (error) {
    throw error;
  }
};

export const patchledger = async (number:any,OSB:any) => {
  try {
    const response = await api.patch(`/ledger/${number}`, { OSB });
    return response;
  } catch (error) {
    throw error;
  }
};

export const postStack = async(postData:any)=>{
  try{
    const response = await api.post(`/stockManagement`, { AgencyName: postData.AgencyName, StockInward: postData.StockInward, Date: postData.Date   });
    return response
  }catch(error){
    throw error;
  }
}