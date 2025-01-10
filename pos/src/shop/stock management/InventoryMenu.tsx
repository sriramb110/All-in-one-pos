import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import iconMap from '../../assets/Icons';

function InventoryMenu() {
    const location = useLocation();
    const icons = (IconComponent: React.ElementType, path: string, name: string) => {
        const isActive = location.pathname === path;
        return (
            <Link to={path} className={`flex items-center font-bold border border-black py-1 px-4 rounded-full ml-5 transition duration-300 transform 
        ${isActive ? 'scale-100 bg-amber-400   text-black' : 'hover:bg-amber-400 hover:text-black hover:scale-75'}`}
            >
                <IconComponent className='text-xl mr-3' />
                <span className="text-sm">{name}</span>
            </Link>
        );
    };

    return (
        <div className='w-full h-auto '>
            <div className='flex overflow-hidden ml-8 p-1  mr-8 mt-2 rounded-full  bg-slate-200 shadow-lg shadow-indigo-500/50 items-center setting-menu'>
                {icons(iconMap['InputIcon'], '/inventory-management/inward', 'Inward')}
                {icons(iconMap['OutputIcon'], '/inventory-management/outward', 'Outward')}
                {icons(iconMap['WarehouseIcon'], '/inventory-management/stock', 'Stock')}
                {icons(iconMap['CallReceivedIcon'], '/inventory-management/internal-expensive', 'Internal Expensive')}
            </div>
        </div>
    );
}

export default InventoryMenu