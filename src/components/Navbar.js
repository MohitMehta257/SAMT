import React, { createContext, useContext, useState } from 'react'
import volkslogo from '../images/volkslogo.png'
import { ChevronFirst, ChevronLast } from 'lucide-react'


const NavbarContext=createContext();

const Navbar = ({children}) => {
  const[expanded,setExpanded]=useState(true);

  const[activeItem,setActiveItem]=useState(null);

  const toggleItem=(item)=>{
    if(activeItem===item)
    {
      setActiveItem(null);
    }

    else
    {
      setActiveItem(item);
    }
  }

  return (
    <>
        <aside class="h-screen">
            <nav class={`h-full flex flex-col bg-white border-r w-52 shadow-sm ${expanded?"w-52":"w-16"}`}>
              <div class="p-4 pb-2 flex justify-between items-center" >
              
                  <img class={`overflow-hidden  transition-all ${expanded ? "w-32":"w-0"}`} src={volkslogo}  alt=""/>
                  <button onClick={()=>setExpanded((curr)=>!curr)} class="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                    {expanded ? <ChevronFirst/>:<ChevronLast/>}
                  </button>
              </div>
              <NavbarContext.Provider value={{expanded}}>
                <ul class="flex-1 px-3" onClick={()=>toggleItem('item1')}>{children}</ul>
                {
                  activeItem==='item1' && expanded==true &&(
                    <ul>
                      <li class="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group">Suboption1</li>
                      
                    </ul>
                  )
                }
              </NavbarContext.Provider>
            </nav>
            
        </aside>  
    </>
  )
}


const NavbarItem=({icon,text,active,alert})=>
{
  const {expanded}=useContext(NavbarContext);


  return(
    <li class={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${expanded?"w-full":"w-12"}  ${active ? "bg-gradient-to-tr-from-indigo-200 to-indigo-100 text-indigo-800":"hover:bg-indigo-50 text-gray-600"}`}>
      {icon}
      <span class={`overflow-hidden transition-all ${expanded?"w-52 ml-3":"w-0"}`}>{text}</span>
      
      {alert && (
        <div class={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "":"top-2"}`}>

        </div>
      )}

      {!expanded && (
        <div class={`absolute left-full rounded-md px-2 py-1 ml-6  bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 
        -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        
        >
          {text}
          
        </div>
      )}
    </li>


  )
}

export  {Navbar,NavbarItem};
