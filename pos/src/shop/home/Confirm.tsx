import React, { useState } from "react";
import { CategoryInterface } from "../Interface";

type CategoryProps = {
  categorys: CategoryInterface[];
  category: (id: string) => void;
};

function Confirm({ categorys, category }: CategoryProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string >('');

  const handleClick = (id: string) => {
    setSelectedCategoryId(id); // Update the selected category ID
    category(id); // Call the category function passed as a prop
  };

  return (
    <div className="w-full h-24 flex">
      <div className="w-3/4 flex flex-wrap border-2 border-black rounded-t-3xl pt-2">
        {categorys.map((i) => (
          <div
            key={i._id}
            onClick={() => handleClick(i._id)}
            className={`px-2 mx-2 my-1 flex border-2 rounded-md text-white text-xl shadow-md h-8 cursor-pointer ${
              selectedCategoryId === i._id
                ? "bg-blue-500 border-blue-700" // Highlighted color for the selected button
                : "bg-zinc-400 border-gray-600" // Default color for unselected buttons
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
