import React, { useEffect, useState } from "react";
import iconMap from "../../assets/Icons";
import { Link, useNavigate } from "react-router-dom";

function Menu() {
  const [visible, setVisible] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);
  const navigator= useNavigate()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000 || window.innerHeight < 700) {
        setVisible(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const icons = (IconComponent: React.ElementType, path: any, name: any) => {
    return (
      <Link
        to={path !== "Logout" && path}
        className="flex flex-col justify-center items-center font-bold overflow-hidden"
        onClick={() => path === "Logout" && setLogout(true)}
      >
        <IconComponent className="mb-5 mr-5 w-5 h-5" />
        {name}
      </Link>
    );
  };

  const iconSmall = (IconComponent: React.ElementType, path: any) => {
    return (
      <Link
        to={path !== "Logout" && path}
        className="flex flex-col justify-center items-center font-bold overflow-hidden"
        onClick={() => path === "Logout" && setLogout(true)}
      >
        <IconComponent className="mb-5 mr-5 w-5 h-5" />
      </Link>
    );
  };
  const confirmLogout=()=>{
      sessionStorage.removeItem("jsonwebtoken");
      setTimeout(() => {
          navigator('/')
      }, 1000);
  }

  return (
    <div className=" w-auto h-auto ">
      <div className="bg-cyan-600 rounded-br-full">
        <div
          className={`flex flex-col w-auto items-center h-screen mb-0 mt-0 rounded-e-3xl bg-fuchsia-400 p-2 transition-all duration-300 overflow-hidden ${
            visible ? "" : "menu"
          }`}
        >
          <div className="flex flex-col w-full justify-evenly items-center h-full menu-icons">
            {icons(iconMap["home"], "/home", "HOME")}
            {icons(iconMap["products"], "/orders", "Orders")}
            {icons(iconMap["wallet"], "/wallet", "Wallet")}
            {icons(iconMap["settings"], "/setting/products", "Setting")}
            {icons(iconMap["Inventory"], "/stockManagement", "Stock")}
            {icons(iconMap["logout"], "Logout", "Logout")}
          </div>
          <div
            className={`flex flex-col w-3/5 justify-evenly items-center h-full ${
              visible ? "" : "max-menu"
            }`}
          >
            {iconSmall(iconMap["home"], "/home")}
            {iconSmall(iconMap["products"], "/orders")}
            {iconSmall(iconMap["wallet"], "/wallet")}
            {iconSmall(iconMap["settings"], "/setting/products")}
            {iconSmall(iconMap["Inventory"], "/stockManagement")}
            {iconSmall(iconMap["logout"], "Logout")}
          </div>
        </div>
      </div>
      <div className="pt-3 max-menu-icon h-16 bg-cyan-600">
        <button className="icon_btn" onClick={() => setVisible(true)}>
          {iconSmall(iconMap["menu"], null)}
        </button>
      </div>
      {logout && (
        <div className="modal">
          <div className="modal-popup ">
            <div className="m-5 flex justify-center flex-col">
              <h1>Are you confirm to logout</h1>
              <div className="full flex justify-center m-2">
                <button className="cancel" onClick={() => setLogout(false)}>
                  Cancel
                </button>
                <button className="confirm" onClick={() => confirmLogout()}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
