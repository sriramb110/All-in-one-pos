import React, { useEffect, useState } from 'react'
import Orders from './Orders'
import Calculations from './Calculations'
import Confirm from './Confirm'
import { category, product } from '../../common_component/services'
import { CategoryInterface, ProductInterface } from '../Interface'

function Home() {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [categorys, setCategory] = useState<CategoryInterface[]>([])
  useEffect(() => {
    getProduct()
    getCategory()
  }, [])

  const getProduct = () => {
    product().then((res) => {
      const getproducts: ProductInterface[] = res.data;
      setProducts(getproducts)
      console.log(getproducts)
    })
  }

  const getCategory = () => {
    category().then((res) => {
      const getCategoryes: CategoryInterface[] = res.data
      setCategory(getCategoryes)
      console.log(getCategoryes)
    })
  }

  return (
    <div className='w-full h-full'>
      <div className='flex h-5/6'>
        <div className='w-3/4'>
          <Orders products={products} />
        </div>
        <div className='w-1/4'>
          <Calculations />
        </div>
      </div>
      <div>
        <Confirm categorys={categorys} />
      </div>
    </div>
  )
}

export default Home