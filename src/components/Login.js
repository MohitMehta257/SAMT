import React, { useState } from 'react'
import axios from 'axios';
import { Navigate, Redirect, Switch, useNavigate } from 'react-router-dom';

export let isManager=false;
export let department="";

const Login = () => {

  const[userName,setUserName]=useState('');
  const[password,setPassword]=useState('');
  const[error,setError]=useState('');
  const navigate=useNavigate();

  const handleLogin=async(e)=>{
    console.log(userName);
    console.log(password);
    e.preventDefault();

    try{
      const response=await axios.post(`http://localhost:8084/api/auth/login`,{
        username:userName,
        password:password
      })

      if(userName==='manager')
      {
        isManager=true;
        department="SFIT";
        
      }

      if(userName==='kashif')
        {
          isManager=true;
          department="MES";
          
        }

      if(userName=='employee')
      {
        isManager=false
  
      }
      console.log(isManager);
      const token=response.data.token;
      sessionStorage.setItem('token',token);
      console.log(token);

      if(isManager)
      {
        navigate('/home/manager');
      }
      else
      {
        navigate('/home/employee');
      }

      if(userName=='superadmin')
      {
        navigate('/pddashboard');
        sessionStorage.setItem('token',response.data.token);
      }
      
    }
    

    catch(error){
      setError('Invalid credentials. Please try again');
      alert("Invalid id or password");
    }
  }

  return (

    <div class="bg-volks">
      <div class="h-screen w-full  bg-volks">
        <div class="ml-[370px] justify-center">
        <img class="ml-14  h-[225px] w-[400px]" src="https://performancemanager10.successfactors.com/public/ui-resource/volkswag04/201;mod=a693ebb71a2e3be69ac502287b9c45cf" alt=""></img>
          
      
        {/* <form onSubmit={handleLogin}>
        <div class="ml-24">
            <p class="text-gray-300">User Name:</p>
            <input type='text' value={userName} onChange={(e)=>setUserName(e.target.value)} style={{
                width: '300px', 
                height: '25px', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                
            }}></input>

        </div>
        
        <div class="ml-24 mt-4">
            <p class="leading-0 text-gray-300">Password:</p>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}  style={{
                width: '300px', 
                height: '25px', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
            }}></input>

        </div>
            <div class="ml-24 w-[300px] cursor-pointer text-center mt-4 bg-blue-400">
              <button type="submit" class="text-white h-[30px]">Log In</button>
            </div>

            </form> */}

            {/* <form onSubmit={handleLogin}>
              <input type='text' value={userName} placeholder='Username' onChange={(e)=>setUserName(e.target.value)} />
              <input type='password 'value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
              <button type='submit'>submit</button>

            </form> */}
          <div class="flex items-center mt-4">
              <p class="ml-[45px] text-white text-3xl">Shift Allowance Management Tool</p>

          </div>
            <form onSubmit={handleLogin}>
            <div class="ml-28">
            <p class="text-gray-300">User Name:</p>
            <input type='text' value={userName} onChange={(e)=>setUserName(e.target.value)} style={{
                width: '300px', 
                height: '25px', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                
            }}/>
            </div>

            <div class="ml-28 mt-4">
            <p class="text-gray-300">Password:</p>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}  style={{
                width: '300px', 
                height: '25px', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
            }}/>

            </div>
            <button class="ml-28 w-[300px] cursor-pointer text-center mt-4 bg-blue-400 text-white h-[30px]" type="submit">Log In</button>
            
            </form>
        </div>  

      </div>
    </div> 
          )
}

export default Login
