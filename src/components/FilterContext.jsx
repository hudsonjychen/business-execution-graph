import { createContext, useState, useContext } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [objectTypes, setObjectTypes] = useState([]);
    const [objectTypeChecked, setObjectTypeChecked] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [processChecked, setProcessChecked] = useState([]);

    return (
        <FilterContext.Provider 
            value={{ 
                objectTypes, setObjectTypes, 
                objectTypeChecked, setObjectTypeChecked,
                processes, setProcesses,
                processChecked, setProcessChecked
            }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => useContext(FilterContext);