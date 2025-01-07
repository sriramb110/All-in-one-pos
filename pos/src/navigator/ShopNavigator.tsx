import React from 'react';
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
import StockManagement from '../shop/stock management/StockManagement';

function ShopNavigator() {
  return (
    <SearchProvider>
      <div className="flex overflow-hidden h-screen w-screen pb-1">
        <Menu />
        <div className=" overflow-hidden">
          <Headers />
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/stockManagement" element={<StockManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ShopNavigator;
