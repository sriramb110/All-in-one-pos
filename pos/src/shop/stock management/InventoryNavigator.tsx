import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import InventoryMenu from './InventoryMenu'
import StockManagement from './StockManagement';

function InventoryNavigator() {
  return (
    <div className="w-full h-screen flex flex-col  overflow-hidden bg-gray-100">
      <InventoryMenu />
      <div className="h-full mt-2 p-1">
        <Routes>
          <Route path="/*" element={<Navigate to="/inventory-management/inward" replace />} />
          <Route path="/inward" element={< StockManagement />} />
          <Route path="/outward" element={<StockManagement />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/internal-expensive" element={<StockManagement />} />
        </Routes>
      </div>
    </div>
  )
}

export default InventoryNavigator