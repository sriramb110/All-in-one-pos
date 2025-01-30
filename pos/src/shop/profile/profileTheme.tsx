import React, { useState } from "react";

function ProfileTheme() {
    const [theme, setTheme] = useState<string>("Colors");
    const [colorTheme, setColorTheme] = useState<string>("");
    const [fontStyle, setFontStyle] = useState<string>("Sans-serif");
    const [selectedArea, setSelectedArea] = useState<string>("Header bar");
    const [choseTheme, setChoseTheme] = useState({
        header: "",
        menu: ''
    });

    const themeStyles: Record<string, string> = {
        Dark: "bg-gray-900 text-white border-gray-600",
        Blue: "bg-blue-500 text-white border-blue-700",
        Green: "bg-green-500 text-white border-green-700",
        Red: "bg-red-500 text-white border-red-700",
        Purple: "bg-purple-500 text-white border-purple-700",
        Orange: "bg-orange-500 text-white border-orange-700",
        Pink: "bg-pink-500 text-white border-pink-700",
        Teal: "bg-teal-500 text-white border-teal-700",
        Yellow: "bg-yellow-400 text-black border-yellow-600",
        Indigo: "bg-indigo-500 text-white border-indigo-700",
        Cyan: "bg-cyan-500 text-black border-cyan-700",
        Amber: "bg-amber-500 text-black border-amber-700",
        Lime: "bg-lime-500 text-black border-lime-700",
        Fuchsia: "bg-fuchsia-500 text-black border-fuchsia-700",
        Rose: "bg-rose-500 text-white border-rose-700",
        Sky: "bg-sky-500 text-white border-sky-700",
        Emerald: "bg-emerald-500 text-white border-emerald-700",
        Slate: "bg-slate-600 text-white border-slate-800",
        Zinc: "bg-zinc-600 text-white border-zinc-800",
        Stone: "bg-stone-600 text-white border-stone-800",
        Neutral: "bg-neutral-600 text-white border-neutral-800",
        DarkGray: "bg-gray-800 text-white border-gray-900",
    };

    const fontStyles: Record<string, string> = {
        "Sans-serif": "font-sans",
        "Serif": "font-serif",
        "Monospace": "font-mono",
        "Thin": "font-thin",
        "Extra Light": "font-extralight",
        "Light": "font-light",
        "Normal": "font-normal",
        "Medium": "font-medium",
        "Semi Bold": "font-semibold",
        "Bold": "font-bold",
        "Extra Bold": "font-extrabold",
        "Black": "font-black",
        "Italic": "italic",
        "Uppercase": "uppercase",
        "Lowercase": "lowercase",
        "Capitalize": "capitalize",
        "Tracking Tight": "tracking-tight",
        "Tracking Wide": "tracking-wide",
        "Text Shadow": "shadow-lg",
        "Underline": "underline",
        "Line-through": "line-through",
        "Overline": "overline",
        "Small Caps": "tracking-widest uppercase text-xs",
        "Loose Spacing": "tracking-wider",
        "Compact Spacing": "tracking-tighter",
    };

    const setAStheme = (theme: string) => {
        setChoseTheme((prev) => ({
            ...prev,
            [selectedArea === "Header bar" ? "header" : "menu"]: theme,
        }));
    };

    const setThemes = ()=>{
        if (choseTheme.header){
            sessionStorage.setItem("HeaderThemesShop", themeStyles[choseTheme.header])

        }
        if (choseTheme.menu) {
            sessionStorage.setItem("MenuThemesShop", themeStyles[choseTheme.menu])
        } 
        if (fontStyle) {
            sessionStorage.setItem("FontThemesShop",fontStyles[fontStyle])
        }
    }


    return (
        <div className="w-full h-full -mt-5 flex justify-center items-center overflow-hidden">
            <div className="w-5/6 h-5/6 border flex flex-col justify-center items-center border-blue-200 rounded-3xl shadow-2xl overflow-hidden p-4">
                <div className="w-full h-1/6 flex justify-center items-center">
                    <h1 className="text-2xl font-bold">POS THEME</h1>
                </div>
                <hr className="w-11/12 border-t border-gray-400 my-4" />
                <div className="w-full border  rounded-xl h-10 flex">
                    <div
                        className={`w-1/2 flex justify-center items-center font-bold text-2xl cursor-pointer ${theme === "Colors" ? "" : "bg-gray-400"
                            } rounded-l-xl`}
                        onClick={() => setTheme("Colors")}
                    >
                        Colors
                    </div>
                    <div
                        className={`w-1/2 flex justify-center items-center font-bold text-2xl cursor-pointer ${theme === "Fonts" ? "" : "bg-gray-400"
                            } rounded-r-xl`}
                        onClick={() => setTheme("Fonts")}
                    >
                        Fonts
                    </div>
                </div>

                <div className="h-5/6 w-full flex flex-col justify-center items-center gap-4">

                    {theme === "Colors" && (
                        <div className="flex-grow w-full  flex flex-col items-center">
                            <div className="flex gap-10 my-4 w-full justify-center">
                                {["Header bar", "Menu bar"].map((area) => (
                                    <div key={area} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="area"
                                            checked={selectedArea === area}
                                            onChange={() => setSelectedArea(area)}
                                        />
                                        <span className={`cursor-pointer ${selectedArea === area ? "text-blue-500 font-bold" : ""}`}>
                                            {area}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Theme Buttons */}
                            <div className="grid grid-cols-6 gap-4 w-full">
                                {Object.keys(themeStyles).map((themeOption) => (
                                    <button
                                        key={themeOption}
                                        className={`px-4 py-2 rounded-lg font-bold text-white shadow-md cursor-pointer transition ${colorTheme === themeOption
                                            ? "scale-110 border-2 border-white"
                                            : "opacity-80"
                                            } ${themeStyles[themeOption]}`}
                                        onClick={() => { setColorTheme(themeOption); setAStheme(themeOption) }}
                                    >
                                        {themeOption}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {theme === "Fonts" && (
                        <div className="flex-grow gap-4 my-4">
                            {Object.keys(fontStyles).map((fontOption) => (
                                <button
                                    key={fontOption}
                                    className={`px-4 py-2 rounded-lg text-black shadow-md m-2 h-10 cursor-pointer transition border border-gray-300 bg-gray-100 ${fontStyle === fontOption
                                        ? "scale-110 border-2 border-black"
                                        : "opacity-80"
                                        } ${fontStyles[fontOption]}`}
                                    onClick={() => setFontStyle(fontOption)}
                                >
                                    {fontOption}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="w-11/12 border-t border-gray-400 my-4" />

                {/* Current Selection */}
                <div className="w-full h-1/6 flex flex-col justify-center items-center">
                    <button className="confirm" onClick={setThemes}>Change Theme</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileTheme;
