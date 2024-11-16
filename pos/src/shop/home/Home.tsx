import React, { useEffect, useState } from "react";
import Orders from "./Orders";
import Calculations from "./Calculations";
import Confirm from "./Confirm";
import { category, product } from "../../common_component/services";
import { CategoryInterface, ProductInterface } from "../Interface";

function Home() {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [categorys, setCategory] = useState<CategoryInterface[]>([]);
  const [filterProduct, setFilterProduct] = useState<ProductInterface[]>([]);

  useEffect(() => {
    getProduct();
    getCategory();
  }, []);

  const getProduct = () => {
    product()
      .then((res) => {
        const getproducts: ProductInterface[] = res.data;
        const shortProduct = getproducts.sort((a,b)=>{return a.productName.localeCompare(b.productName)})
        setProducts(shortProduct);
        setFilterProduct(shortProduct);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategory = () => {
    category()
      .then((res) => {
        const getCategoryes: CategoryInterface[] = res.data;
        const allCategory = {
          _id: "",
          name: "All",
        };
        setCategory([allCategory, ...getCategoryes]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filtercategory = (id:any) => {
    if(id){
      const filter = products.filter((i) => i.categoryType === id)
      setFilterProduct(filter);
    }else{
      setFilterProduct(products);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex h-5/6">
        <div className="w-3/4">
          <Orders products={filterProduct} />
        </div>
        <div className="w-1/4">
          <Calculations />
        </div>
      </div>
      <div>
        <Confirm categorys={categorys} category={filtercategory} />
      </div>
    </div>
  );
}

export default Home;
