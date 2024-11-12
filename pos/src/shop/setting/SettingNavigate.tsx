import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SettingMenu from './SettingMenu';
import Products from './Products';
import Customers from './Customers';
import Employee from './Employee';
import Branches from './Branches';

function SettingNavigate() {
    return (
        <div className="w-full h-full flex flex-col  overflow-hidden">
            <SettingMenu />
            <div className="h-auto">
                <Routes>
                    <Route path="/*" element={<Navigate to="/setting/products" replace />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customer" element={<Customers />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/branches" element={<Branches />} />
                </Routes>
            </div>
        </div>
    );
}

export default SettingNavigate;
