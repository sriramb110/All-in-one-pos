import React, { useEffect, useState } from 'react';
import iconMap from '../../assets/Icons';
import { Link } from 'react-router-dom';

function Menu() {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1000 || window.innerHeight < 700) {
                setVisible(false);
            }
        };
        handleResize(); // Set initial state based on current window size
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const icons = (IconComponent: React.ElementType, path: any, name: any) => {
        return (
            <Link to={path} className='flex flex-col justify-center items-center font-bold overflow-hidden'>
                <IconComponent className='mb-5 mr-5 w-5 h-5' />
                {name}
            </Link>
        );
    };

    const iconSmall = (IconComponent: React.ElementType, path: any) => {
        return (
            <Link to={path} className='flex flex-col justify-center items-center font-bold overflow-hidden'>
                <IconComponent className='mb-5 mr-5 w-5 h-5' />
            </Link>
        );
    };

    return (
        <div className=' w-auto h-auto '>
            <div className='bg-cyan-600 rounded-br-full'>
                <div className={`flex flex-col w-auto items-center h-screen mb-0 mt-0 rounded-e-3xl bg-fuchsia-400 p-2 transition-all duration-300 overflow-hidden ${visible ? '' : 'menu'}`}>
                    <div className='flex flex-col w-full justify-evenly items-center h-full menu-icons'>
                        {icons(iconMap['home'], '/home', 'HOME')}
                        {icons(iconMap['cart'], '', 'Cart')}
                        {icons(iconMap['products'], '', 'Orders')}
                        {icons(iconMap['wallet'], '', 'Wallete')}
                        {icons(iconMap['settings'], '/setting/products', 'Setting')}
                        {icons(iconMap['logout'], '', 'Logout')}
                    </div>
                    <div className={`flex flex-col w-3/5 justify-evenly items-center h-full ${visible ? '' : 'max-menu'}`}>
                        {iconSmall(iconMap['home'], '',)}
                        {iconSmall(iconMap['cart'], '',)}
                        {iconSmall(iconMap['products'], '',)}
                        {iconSmall(iconMap['wallet'], '',)}
                        {iconSmall(iconMap['settings'], '/setting/products',)}
                        {iconSmall(iconMap['logout'], '',)}
                    </div>
                </div>
            </div>
            <div className='pt-3 max-menu-icon h-16 bg-cyan-600'>
                <button className='icon_btn' onClick={() => setVisible(true)}>
                    {iconSmall(iconMap['menu'], null)}
                </button>
            </div>
        </div>
    );
}

export default Menu;
