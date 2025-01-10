import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import iconMap from '../../assets/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from './SearchContext';

function Headers() {
    const {searchTerm, setSearchTerm} = useSearch();
    const [today, setToday] = useState({
        date: "",
        time: ""
    });
    const navigator= useNavigate()
    const location = useLocation();
    useEffect(() => {
        const updateTime = () => {
            const time = new Date().toLocaleTimeString();
            const date = new Date().toLocaleDateString();
            setToday({
                date: date,
                time: time
            })
        };
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, [location]);

    const icons = (IconComponent: React.ElementType,) => {
        return (
            <IconComponent className='mb-5 mr-5 w-5 h-5' />
        );
    };
    const headerName = () => {
        if (location.pathname.startsWith("/order/")) {
          return "POS Order - Details";
        }
        if (location.pathname.startsWith("/wallet/")) {
          return "POS Ledger - Details";
        }
        switch (location.pathname) {
          case "/setting/products":
            return "Setting - Products";
          case "/setting/customer":
            return "Setting - Customer";
          case "/setting/branches":
            return "Setting - Branches";
          case "/setting/employee":
            return "Setting - Employee";
          case "/home":
            return "POS Home";
          case "/orders":
            return "POS Orders";
          case "/wallet":
            return "POS Wallet";
          case "/inventory-management/stock":
            return "Stock Management";
          case "/inventory-management/inward":
            return "Inward";
          case "/inventory-management/outward":
            return "Outward";
          case "/inventory-management/internal-expensive":
            return "Internal Expensive"
          default:
            return "POS";
        }
    };

    return (
        <div className='w-auto h-16 bg-cyan-600 p-4 text-white flex'>
            <div className='pl-5 flex justify-between w-full pr-10'>
                <h1 className='text-3xl ml-2 w-2/6'>{headerName()}</h1>
                <input
                    className='bg-white w-2/6 rounded-full px-4  text-black header-search'
                    id=""
                    value={searchTerm}
                    placeholder='Search'
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='flex w-2/6 justify-end'>
                    <IconButton aria-label="" onClick={() => navigator('/profile')}>
                        {icons(iconMap['profile'])}
                    </IconButton>
                    <div className='-mt-2 w-24 flex justify-end'>
                        {today.time}<br />
                        {today.date}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Headers