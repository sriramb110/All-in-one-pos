import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import iconMap from '../../assets/Icons';
import { useLocation } from 'react-router-dom';
import { useSearch } from './SearchContext';

function Headers() {
    const {searchTerm, setSearchTerm} = useSearch();
    const [major, setMajor] = useState<boolean>(false);
    const [today, setToday] = useState({
        date: "",
        time: ""
    });
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
        switch (location.pathname) {
            case '/setting/products':
                return 'Setting - Products';
            case '/setting/customer':
                return 'Setting - Customer';
            case '/setting/branches':
                return 'Setting - Branches';
            case '/setting/employee':
                return 'Setting - Employee';
            case '/home':
                return 'POS Home';
            default:
                return 'POS';
        }
    };

    return (
        <div className='w-auto h-16 bg-cyan-600 p-4 text-white flex'>
            <div className='pl-5 flex justify-between w-screen pr-10'>
                <h1 className='text-3xl ml-2 w-72'>{headerName()}</h1>
                <input
                    className='bg-white w-1/4 rounded-full px-4  text-black header-search'
                    id=""
                    value={searchTerm}
                    placeholder='Search'
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='flex'>
                    <IconButton aria-label="" onClick={() => setMajor(!major)}>
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