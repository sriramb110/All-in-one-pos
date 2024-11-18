import React, { useState } from "react";
import { CategoryInterface } from "../Interface";

type CategoryProps = {
  categorys: CategoryInterface[];
  category: (id: string) => void;
};

function Confirm({ categorys, category }: CategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string >('');

  const handleClick = (id: string) => {
    setSelectedCategoryId(id);
    category(id);
  };

  return (
    <div className="w-full h-5/6 flex">
      <div className="w-5/6 h-full pt-2 flex flex-wrap border-2 border-black rounded-t-3xl">
        {categorys.map((i) => (
          <div
            key={i._id}
            onClick={() => handleClick(i._id)}
            className={`px-2 mx-2 my-1 flex border-2 rounded-md text-white text-xl shadow-md h-8 cursor-pointer ${
              selectedCategoryId === i._id
                ? "bg-blue-500 border-blue-700" 
                : "bg-zinc-400 border-gray-600"
            }`}
          >
            {i.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Confirm;
