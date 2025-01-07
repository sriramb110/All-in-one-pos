import React, { useEffect, useState } from 'react'
import { product } from '../../common_component/services'
import { ProductInterface } from '../Interface';

function StockManagement() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getProduct()
  }, [])

  const getProduct = ()=>{
    product()
      .then((res) => {
        const getproducts: ProductInterface[] = res.data;
        const shortProduct = getproducts.sort((a, b) => {
          return a.productName.localeCompare(b.productName);
        });
        setProducts(shortProduct);
        setFilterProduct(shortProduct);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }
  return (
    <div>StockManagement</div>
  )
}

export default StockManagement