import React from 'react';
import Menu from '../common_component/menu/Menu';
import Headers from '../common_component/menu/Headers';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../shop/home/Home';
import SettingNavigate from '../shop/setting/SettingNavigate';
import { SearchProvider } from '../common_component/menu/SearchContext';
import OverallOrders from '../shop/Orders/OverallOrders';
import ThermalPrinterTest from './ThermalPrinterTest';
import Orders from '../shop/Orders/Orders';
import CustomerLedger from '../shop/Wallet/CustomerLedger';
import CustomerLedgerDetails from '../shop/Wallet/CustomerLedgerDetails';

function ShopNavigator() {
  return (
    <SearchProvider>
      <div className="flex overflow-hidden h-screen w-screen">
        <Menu />
        <div className=" overflow-hidden">
          <Headers />
          <div className="overflow-hidden w-full h-full pb-9">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home/*" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/setting/*" element={<SettingNavigate />} />
              <Route path="/orders" element={<OverallOrders />} />
              <Route path="/order/:id" element={<Orders />} />
              <Route path="/wallet" element={<CustomerLedger />} />
              <Route path="/wallet/:id" element={<CustomerLedgerDetails />} />
              <Route path="/data" element={<ThermalPrinterTest />} />
            </Routes>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ShopNavigator;
