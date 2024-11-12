import React from 'react'
import { CategoryInterface } from '../Interface';
type CategoryProps = {
  categorys: CategoryInterface[];
};

function Confirm({ categorys }: CategoryProps) {
  return (
    <div className='w-full h-24 flex'>
      <div className=' w-3/4 flex flex-wrap border-2 border-black rounded-t-3xl pt-2'>
        {categorys.map((i) => (<div className='px-2 mx-2 my-1 flex border-2 border-gray-600 rounded-md bg-zinc-400 text-white text-xl shadow-md h-8 cursor-pointer'>{i.name}</div>))}
      </div>
    </div>
  )
}

export default Confirm