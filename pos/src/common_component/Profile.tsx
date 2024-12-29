import React, { useRef } from 'react';
import downloadImage from '../assets/download.png'

function Profile() {
    const firstContainerRef = useRef<HTMLDivElement>(null);
    const secondContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const MyProfile = () => {
        if (firstContainerRef.current) {
            const parentContainer = document.querySelector('.w-full.h-full.overflow-auto');
            const yOffset = -64;
            const yPosition =
                firstContainerRef.current.getBoundingClientRect().top +
                (parentContainer ? parentContainer.scrollTop : window.scrollY) +
                yOffset;

            if (parentContainer) {
                parentContainer.scrollTo({ top: yPosition, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: yPosition, behavior: 'smooth' });
            }
        }
    };

    const handleScrollToFirstContainer = () => {
        if (secondContainerRef.current) {
            const parentContainer = document.querySelector('.w-full.h-full.overflow-auto');
            const yOffset = -64;
            const yPosition =
                secondContainerRef.current.getBoundingClientRect().top +
                (parentContainer ? parentContainer.scrollTop : window.scrollY) +
                yOffset;

            if (parentContainer) {
                parentContainer.scrollTo({ top: yPosition, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: yPosition, behavior: 'smooth' });
            }
        }
    };

    const Profile = () => {
        if (containerRef.current) {
            const parentContainer = document.querySelector('.w-full.h-full.overflow-auto');
            const yOffset = -64;
            const yPosition =
                containerRef.current.getBoundingClientRect().top +
                (parentContainer ? parentContainer.scrollTop : window.scrollY) +
                yOffset;

            if (parentContainer) {
                parentContainer.scrollTo({ top: yPosition, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: yPosition, behavior: 'smooth' });
            }
        }
    };


    return (
        <div className="w-full h-full overflow-auto flex">
            <div className='fixed w-72 flex flex-col justify-start items-center border border-gray-300 rounded-e-3xl pr-1' style={{height:'93%'}}>
                <img src={downloadImage} alt="Description of image" className='w-52 h-52 rounded-full '/>

                <button
                    onClick={Profile}
                    className="relative w-full flex justify-end px-4 py-2 mt-4 overflow-hidden group bg-gradient-to-r from-gray-200 to-blue-700 text-white rounded-e-full "
                >
                    <span className="absolute inset-0 bg-blue-200 transition-transform duration-200 -translate-x-full group-hover:translate-x-0"></span>
                    <span className="absolute inset-0 bg-blue-500 transition-transform duration-1000 translate-x-full group-hover:translate-x-0"></span>
                    <span className="relative z-10">My Profile</span>
                </button>
                <button
                    onClick={MyProfile}
                    className="relative w-full flex justify-end px-4 py-2 mt-4 overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-e-full "
                >
                    <span className="absolute inset-0 bg-blue-200 transition-transform duration-200 -translate-x-full group-hover:translate-x-0"></span>
                    <span className="absolute inset-0 bg-blue-500 transition-transform duration-1000 translate-x-full group-hover:translate-x-0"></span>
                    <span className="relative z-10">Work Profile</span>
                </button>
                <button
                    onClick={handleScrollToFirstContainer}
                    className="relative w-full flex justify-end px-4 py-2 mt-4 overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-e-full "
                >
                    <span className="absolute inset-0 bg-blue-200 transition-transform duration-200 -translate-x-full group-hover:translate-x-0"></span>
                    <span className="absolute inset-0 bg-blue-500 transition-transform duration-1000 translate-x-full group-hover:translate-x-0"></span>
                    <span className="relative z-10">Profile Theme</span>
                </button>

            </div>
            <div ref={containerRef} className="flex flex-col w-full h-fit items-center overflow-hidden">
                <div className="h-screen w-full flex items-center justify-start bg-gradient-to-r from-gray-200 to-blue-200">
                    <div className='w-72 flex h-full rounded-e-3xl'></div>
                    <div className='w-5/6'>
                        profile
                    </div>
                    
                </div>
                <div
                    ref={firstContainerRef}
                    className="h-screen w-full flex items-center justify-start bg-gradient-to-r from-gray-200 bg-red-100 "
                >
                    <div className='w-72 flex h-full rounded-e-3xl'></div>
                    <div className='w-5/6'>
                       My profile
                    </div>
                </div>
                <div
                    ref={secondContainerRef}
                    className="h-screen w-full flex items-center justify-start bg-gradient-to-r from-gray-200 bg-neutral-200 "
                >
                    <div className='w-72 flex h-full rounded-e-3xl'></div>
                    <div className='w-5/6'>
                        profile Theme
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
