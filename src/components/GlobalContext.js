import React, { createContext, useState,useContext, Children } from 'react'

const GlobalContext=createContext();

export const GlobalProvider=({children})=>{
    const[isOn,setIsOn]=useState(false);

    const updateGlobalValue=()=>{
        if(isOn==true)
        {
            setIsOn(false);
        }
        else
        {
            setIsOn(true);
        }
    }


    return (
        <GlobalContext.Provider value={{isOn,updateGlobalValue}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobal=()=>useContext(GlobalContext);