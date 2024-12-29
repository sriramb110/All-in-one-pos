import React from "react";
import downloadImage from "../../assets/download.png";

const MyProfile: React.FC = () => {
    const personalDetails = [
        { header: 'FIRST NAME', condent: 'SRIRAM' },
        { header: 'LAST NAME', condent: 'B' },
        { header: 'Phone number', condent: '9876543210' },
        { header: 'Email ID', condent: 'sriramb110@gmail.com' },
        { header: 'Adderss line 1', condent: 'Keelaraja street' },
        { header: 'Adderss line 2', condent: 'Oottathur' },
        { header: 'City', condent: 'Trichy' },
        { header: 'State', condent: 'Tamilnadu' },
    ]
    return (
        <div className="w-full h-full -mt-5 flex justify-center items-center overflow-hidden">
            <div className="w-1/2 h-5/6 border flex flex-col justify-center items-center border-blue-200 rounded-3xl shadow-2xl overflow-hidden">
                <div className="w-full h-fit flex p-1">
                    <img src={downloadImage} alt="Profile" className="w-56 h-56 rounded-full ml-20 mt-2" />
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <h1 className="font-serif text-3xl">MY PROFILE</h1>
                        <div className="gap-2 pt-2">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-full m-2 hover:bg-blue-700">EDIT</button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-full m-2 hover:bg-green-700" >MEMBERSHEP</button>
                        </div>
                    </div>
                </div>
                <hr className="w-11/12 border-t border-gray-400 my-4" />
                <div className="w-full h-fit flex flex-col justify-center items-center gap-5">
                    {personalDetails.map((i) => (
                        <div className="flex w-5/6 gap-2">
                            <h1 className="w-52 text-xl">{i.header}</h1>:
                            <p className="w-fit text-xl">{i.condent}</p>
                        </div>
                    ))}
                </div>
                <hr className="w-11/12 border-t border-gray-400 my-4" />
                <div className="w-full h-1/4 ">
                
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
