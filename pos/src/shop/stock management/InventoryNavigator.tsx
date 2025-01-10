import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import InventoryMenu from './InventoryMenu'
import Inward from './Inward';
import Stock from './Stock';

function InventoryNavigator() {
  return (
    <div className="w-full h-screen flex flex-col  overflow-hidden bg-gray-100">
      <InventoryMenu />
      <div className="h-full mt-2 p-1">
        <Routes>
          <Route path="/*" element={<Navigate to="/inventory-management/inward" replace />} />
          <Route path="/inward" element={< Inward />} />
          <Route path="/outward" element={<Inward />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/internal-expensive" element={<Inward />} />
        </Routes>
      </div>
    </div>
  )
}

export default InventoryNavigator