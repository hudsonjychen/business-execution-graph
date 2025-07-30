import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [mode, setMode] = useState("discovery");
    const [fileImported, setFileImported] = useState(null);
    const [pngDataUrl, setPngDataUrl] = useState(null);
    const [vosData, setVosData] = useState(null);

    return (
        <GlobalContext.Provider 
            value={{ 
                mode, setMode, 
                fileImported, setFileImported,
                pngDataUrl, setPngDataUrl,
                vosData, setVosData
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);