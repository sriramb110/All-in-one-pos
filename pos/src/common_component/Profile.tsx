import React, { useRef } from "react";
import downloadImage from "../assets/download.png";
import MyProfileComponent from "../shop/profile/myProfile";
import WorkProfileComponent from "../shop/profile/workProfile";
import ProfileThemeComponent from "../shop/profile/profileTheme";

const Profile: React.FC = () => {
    const firstContainerRef = useRef<HTMLDivElement>(null);
    const secondContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToElement = (elementRef: React.RefObject<HTMLDivElement>) => {
        if (elementRef.current) {
            const parentContainer = document.querySelector(".w-full.h-full.overflow-auto");
            const yOffset = -64;
            const yPosition =
                elementRef.current.getBoundingClientRect().top +
                (parentContainer ? parentContainer.scrollTop : window.scrollY) +
                yOffset;

            if (parentContainer) {
                parentContainer.scrollTo({ top: yPosition, behavior: "smooth" });
            } else {
                window.scrollTo({ top: yPosition, behavior: "smooth" });
            }
        }
    };

    const handleScrollToProfile = () => scrollToElement(containerRef);
    const handleScrollToWorkProfile = () => scrollToElement(firstContainerRef);
    const handleScrollToProfileTheme = () => scrollToElement(secondContainerRef);

    return (
        <div className="w-full h-full overflow-auto flex bg-gradient-to-r from-gray-50 to-blue-100">
            <div
                className="fixed flex flex-col justify-start items-center bg-blue-100 text-white rounded-e-3xl"
                style={{ height: "93%", width: "12%" }}
            >
                <img src={downloadImage} alt="Profile" className="w-fit h-fit mt-4 rounded-full border-4 border-white shadow-lg" />
                <button
                    onClick={handleScrollToProfile}
                    className="relative w-5/6 flex justify-center items-center px-4 py-3 mt-6 text-sm font-bold transition-all duration-300 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-700"
                >
                    <span className="relative z-10">My Profile</span>
                </button>
                <button
                    onClick={handleScrollToWorkProfile}
                    className="relative w-5/6 flex justify-center items-center px-4 py-3 mt-6 text-sm font-bold transition-all duration-300 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-700"
                >
                    <span className="relative z-10">Work Profile</span>
                </button>
                <button
                    onClick={handleScrollToProfileTheme}
                    className="relative w-5/6 flex justify-center items-center px-4 py-3 mt-6 text-sm font-bold transition-all duration-300 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-700"
                >
                    <span className="relative z-10">Theme</span>
                </button>
            </div>
            <div ref={containerRef} className="flex flex-col w-full h-fit items-center overflow-hidden">
                <div className="h-screen w-full flex items-center justify-start ">
                    <div style={{ width: "11%" }}></div>
                    <div className="w-full h-full pl-2">
                        <MyProfileComponent />
                    </div>
                </div>
                <div
                    ref={firstContainerRef}
                    className="h-screen w-full flex items-center justify-start bg-gradient-to-r "
                >
                    <div style={{ width: "11%" }}></div>
                    <div className="w-full h-full pl-2"><WorkProfileComponent /></div>
                </div>
                <div
                    ref={secondContainerRef}
                    className="h-screen w-full flex items-center justify-start bg-gradient-to-r "
                >
                    <div style={{ width: "11%" }}></div>
                    <div className="w-full h-full pl-2"><ProfileThemeComponent /></div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
