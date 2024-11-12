import React from 'react';
import Menu from '../common_component/menu/Menu';
import Headers from '../common_component/menu/Headers';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../shop/home/Home';
import SettingNavigate from '../shop/setting/SettingNavigate';
import { SearchProvider } from '../common_component/menu/SearchContext';

function ShopNavigator() {
  return (
    <SearchProvider>
      <div className='flex overflow-hidden h-screen w-screen'>
        <Menu />
        <div className=' overflow-hidden'>
          <Headers />
          <div className='overflow-hidden w-full h-full'>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home/*" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/setting/*" element={<SettingNavigate />} />
            </Routes>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ShopNavigator;
