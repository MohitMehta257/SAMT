import React from 'react'
import { useGlobal } from './GlobalContext'

const ComponentB = () => {
    const{isOn}=useGlobal();
    console.log(isOn);
  return (
    <div>
      <p>mohit </p>
    </div>
  )
}

export default ComponentB
