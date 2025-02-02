import React, { useEffect, useState } from 'react';
import Menu from '../common_component/menu/Menu';
import Headers from '../common_component/menu/Headers';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../shop/home/Home';
import SettingNavigate from '../shop/setting/SettingNavigate';
import { SearchProvider } from '../common_component/menu/SearchContext';
import OverallOrders from '../shop/Orders/OverallOrders';
import Orders from '../shop/Orders/Orders';
import CustomerLedger from '../shop/Wallet/CustomerLedger';
import CustomerLedgerDetails from '../shop/Wallet/CustomerLedgerDetails';
import Profile from '../common_component/Profile';
import InventoryNavigator from '../shop/stock management/InventoryNavigator';

function ShopNavigator() {
  const [font, setFont] = useState<string>("font-sans")
  const [bgMColor, setMBgColor] = useState<string>("bg-fuchsia-500 text-black border-fuchsia-700")
  const [hBgColor, setHBgColor] = useState<string>("bg-blue-500 text-white border-blue-700")
  
  useEffect(() => {
    theme()
  }, [])

  function theme() {
    const Fontthemes = localStorage.getItem("FontThemesShop")
    if (Fontthemes) { setFont(Fontthemes) } else { setFont("font-sans") }

    const bgMenu = localStorage.getItem("MenuThemesShop");
    if (bgMenu) { setMBgColor(bgMenu) } else { setMBgColor("bg-fuchsia-500 text-black border-fuchsia-700") };

    const bgHeader = localStorage.getItem("HeaderThemesShop");
    if (bgHeader) { setHBgColor(bgHeader) } else { setHBgColor("bg-blue-500 text-white border-blue-700") };
  }

  const themChange = () => {
    theme()
  }

  return (
    <SearchProvider>
      <div className={`flex overflow-hidden h-screen w-screen pb-1 ${font}`}>
        <Menu bgMColor={bgMColor} hBgColor={hBgColor} />
        <div className="w-full h-full  overflow-hidden">
          <Headers hBgColor={hBgColor} />
          <div className="overflow-hidden w-full h-full pb-5 p-0.5">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home/*" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/setting/*" element={<SettingNavigate />} />
              <Route path="/orders" element={<OverallOrders />} />
              <Route path="/order/:id" element={<Orders />} />
              <Route path="/wallet" element={<CustomerLedger />} />
              <Route path="/wallet/:id" element={<CustomerLedgerDetails />} />
              <Route path="/profile" element={<Profile themChange={themChange} />} />
              <Route path="/inventory-management/*" element={<InventoryNavigator />} />
            </Routes>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ShopNavigator;
