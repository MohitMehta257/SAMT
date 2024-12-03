import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {Dialog, DialogContent } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import blankprofile from '../images/blank-profile.webp'
import volkslogo from '../images/volkslogo.png'


const Employee = () => {
  const{name,current_month,current_year,access,department}=useParams();

  const[employeeEmail,setEmployeeEmail]=useState("");
  const[employeeId,setEmployeeId]=useState(null);
  const[employeeDept,setEmployeeDept]=useState("");

  const[user,setUsers]=useState({});

  const[showDialog,setShowDialog]=useState(false);

  const[formData,setFormData]=useState({
    email:employeeEmail,
    id:employeeId,
    name:name,
  });

  const[deleteConfirmation,setDeleteConfirmation]=useState(false);


  const[vaildEmail,isValidEmail]=useState(true);
  const[validId,setValidId]=useState("");

  const validateId=(id)=>{
    if(id.length<6)
    {
      setValidId("Id cannot be less than 6 digits");
    }

    if(id.length==6)
    {
      setValidId("");
    }

    if(id.length>6)
    {
      setValidId("Id cannot be more than 6 digits");
    }
  }

  const validateEmail=(email)=>{
    //const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //const regex="/b[A-Z0-9a-z._%+-]+@volkswagen\.co.in"
    const regex=/^[a-zA-Z0-9_.+-]+[@volkswagen]+\.[co]+\.in/
    isValidEmail(regex.test(email));
  }

  const handleDeleteClick=()=>{
    setDeleteConfirmation(true);
  }

  const handleDeleteCancel=()=>{
    setDeleteConfirmation(false);
  }


  useEffect(()=>{
    const data=async()=>{
      try{
        const respose=await fetch('http://localhost:8084/api/shift/details/'+name+"?month="+current_month+"&year="+current_year+"&department="+department,{
          headers:{
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        if(!respose.ok)
        {
          console.log('Network response was not ok');
        }

        const responseData=await respose.json();
        setUsers(responseData);
        const object=responseData['employee']
        setEmployeeEmail(object.email);
        setEmployeeId(object.employeeId);
        setEmployeeDept(object.department);
        //console.log(JSON.stringify(user,null,2));
        //console.log(user['employee']['employeeName']);
        console.log(user);
      }
      catch(error)
      {
        console.log(error);
      }
  };
data();},[]);



const[currentUser,setCurrentUser]=useState(user.employee);

const handleUpdateClick=(user)=>{
  setCurrentUser(user)
  setFormData({
    email:employeeEmail,
    id:employeeId,
    name:name
  });
  console.log(formData);
  setShowDialog(true);
};

const handleCloseDialog=()=>{
  setShowDialog(false);
}

const handleChange=(e)=>{
  setFormData({
    ...formData,
    [e.target.name]:e.target.value
  })

  if(e.target.name=='email')
  {
    validateEmail(e.target.value);
    console.log(vaildEmail);
  }

  if(e.target.name=='id')
  {
    validateId(e.target.value);
  }
  console.log(e.target.name);
  console.log(e.target.value);
}



const handleUpdateUser=async()=>{
  const employee_update_object={
    "employee":{
      "email":formData.email,
      "employeeId":formData.id,
      "employeeName":name
    }
  }
  try{
    await axios.put(`http://localhost:8084/api/shift/update/${name}?department=${department}`,employee_update_object,{
      headers:{
        Authorization:`Bearer ${sessionStorage.getItem('token')}`
      }
    });
    setShowDialog(false);
    console.log('User updated successfully');
    
  }
  catch(error){
    console.error('Error updating user: ',error);
  }

  window.location.reload();
}
// const data=async()=>{
//   try{
//     if(!respose.ok)
//     {
//       console.log('Network response was not ok');
//     }

//     const responseData=await respose.json();
//     setUsers(responseData);
//   }
//   catch(error)
//   {
//     console.log(error);
//   }
// }

//   data();

//   console.log(user)

  const[viewYear,setViewYear]=useState("View Year");
  const[viewMonth,setViewMonth]=useState("");

  const handleViewYear=(value)=>{
    setViewYear(value);
  }

  const[hoveredCell, setHoveredCell]=useState();
  const handleCellHover=(cellId)=>{
    setHoveredCell(cellId);
  }

  const handleCellLeave=()=>{
    setHoveredCell(null);
  }


  const handleDelete=()=>{
    try{
        axios.delete(`http://localhost:8084/api/shift/delete/${name}`,{
          headers:{
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
      console.log("Item successfully deleted");
      setDeleteConfirmation(false);
      window.location.reload();
    }
    catch(error){
      console.error('Error deleting item');
    }
  }

  async function fetchData(month){
    setViewMonth(month)
    try{
      const response=await fetch('http://localhost:8084/api/shift/details/'+name+"?month="+month+"&year="+viewYear+"&department="+department,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      const jsonData=await response.json();
      setUsers(jsonData);
      setEmployeeEmail(user.employee.email);
      setEmployeeDept(user.employee.department);
      
    }
    catch(error)
    {
      console.error("Error fetching the data: ",error);
    }
  }

  {user.totalCount=user.morningShiftCount+user.nightShiftCount+user.afternoonShiftCount}

    let time=new Date().toLocaleTimeString();

  const[currentTime,setCurrentTime]=useState(time);

  const updateTime=()=>{
    let time=new Date().toLocaleTimeString();
    setCurrentTime(time);
  }
  
  setInterval(updateTime,1000);

  const now=new Date();
  const daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  const dayOfWeek=daysOfWeek[now.getDay()];
  
  return (

    <div>
        <div class="bg-volks h-20 pt-2 flex flex-row">
        <div class="w-2/12 ml-10 h-2">
          <img class="h-11 w-52" src={volkslogo} alt=""></img>
        </div>

        <div class="relative inline-block text-left">
  <div class="ml-8 bg-volks">
    <button disabled={true} type="button" class="border-hidden hover:bg-black inline-flex w-full justify-center gap-x-1.5 rounded-md bg-volks px-3 py-2 text-sm font-semibold text-white   cursor-pointer" id="menu-button" aria-expanded="true" aria-haspopup="true">
      Home
      <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="white" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

 
  <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
  </div>
</div>

    <div class="mt-3 flex flex-row ml-[625px]">

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="ml-8 bi bi-check-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="ml-8 bi bi-envelope-x" viewBox="0 0 16 16">
        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0"/>
      </svg>


      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="ml-8 bi bi-bell" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
      </svg>


      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="ml-8 bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
      </svg>

      </div>
      
      </div>    

      <div class="w-full h-80 bg-ballon">
        <div class="ml-[850px] flex flex-row pt-8">

          <div class="text-white text-sm text-white w-20 flex flex-row  rounded hover:bg-slate-400 cursor-pointer hover:text-blue-800">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="mt-1 bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
          </svg>
          &nbsp;Actions */}
          </div>

          <div class="text-white text-sm w-20 flex flex-row  rounded ml-4 hover:bg-slate-400 cursor-pointer hover:text-blue-800">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="mt-1 bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
          </svg>
          &nbsp;Header */}
          </div>


          <div class="text-white text-sm w-24 flex flex-row rounded ml-4 hover:bg-slate-400 cursor-pointer hover:text-blue-800">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="mt-1 bi bi-calendar" viewBox="0 0 16 16">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
          </svg>
          &nbsp;As of Today */}
          </div>


        </div>

        <div class="flex flex-row">
        <div class="ml-8 h-1/5 w-1/5">
          <img class="rounded-full w-4/5 h-4/5" src={blankprofile} alt=""></img>
        </div>

        <div class="mt-8 ml-2 ">
          <h1 class="text-3xl text-white font-bold">{name}</h1>
          <p class="leading-3">{dayOfWeek}   {currentTime}</p>
          <p class="leading-3">HR & WFI (38000002), VWITS India</p>
          <p class="leading-3">India (India)</p>
          <p class="leading-3">{employeeDept}</p>
          <p class="text-blue-800 leading-3 hover:underline cursor:pointer">{employeeEmail}</p>


        </div>

        </div>

      </div>

      

      <div class="flex">
      
      <div class="dropdown mt-3 ml-28">
                <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  {viewYear}
                </button>
                <ul class="dropdown-menu cursor-pointer" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2022)}>2022</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2023)}>2023</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2024)}>2024</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2025)}>2025</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2026)}>2026</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2027)}>2027</a></li>
                </ul>
      </div>


    <div class="ml-16">
      <div class="">
      <ul class="flex gap-x-4 py-3 px-4 m-0 overflow-x-scroll scrollbar-hide">
      <li class="cursor-pointer" onClick={()=>fetchData("January")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">Jan </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("February")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">Feb </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("March")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >Mar </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("April")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >Apr </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("May")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >May </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("June")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">June </a>
      </li>
      </ul>
      </div>

      <div>
      <ul class="flex gap-x-4 py-3 px-4 m-0 overflow-x-scroll scrollbar-hide">
      <li class="cursor-pointer" onClick={()=>fetchData("July")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">July </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("August")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >Aug </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("September")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >Sept </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("October")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks" >Oct </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("November")}>
        <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">Nov </a>
      </li>

      <li class="cursor-pointer" onClick={()=>fetchData("December")}>
        <a  class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">Dec </a>
      </li>

      </ul>
  
      </div>

      </div>

      </div>

      <div class="justify-center mb-2">
        <h1 class="text-center">{name} {viewMonth} Rota</h1>
      </div>

      <table class="table table-bordered ">
  <thead>
    <tr>
    <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Employee ID</th>
      {/* <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Serial No</th> */}
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Employee</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">General</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Morning</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">AfterNoon</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Night</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Total</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Allowance(INR)</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Sunday</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Planed Leaves</th>
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Unplanned Leaves</th>
      {user.month==='Jan'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Govt Holiday (26th Jan)</th>}
      {user.month==='May'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Govt Holiday (1st May)</th>}
      {user.month==='Aug'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Govt Holiday (15th Aug)</th>}
      {user.month==='Oct'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Govt Holiday (2nd Oct)</th>}
      
      {access=='manager' &&(
      <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Actions</th>)}
    </tr>
  </thead>
  <tbody>
  <tr>
        <td>{employeeId}</td>
        {/* <td class="cursor-pointer">{user.employee.employeeName}</td> */}
        <td class="cursor-pointer">{name}</td>
        <td>{user.general}</td>
        <td>{user.morningShiftCount}</td>
        <td>{user.afternoonShiftCount}</td>
        <td>{user.nightShiftCount}</td>

        {/* <td>{user.morningShiftCount}+{user.nightShiftCount}+{user.afternoonShiftCount}</td> */}
        <td>{user.totalCount}</td>
        <td>₹ {user.totalMoney}</td>
        <td onMouseOver={()=>handleCellHover('cell'+user.id)} onMouseOut={(handleCellLeave)}>{user.sundayCount}
          {hoveredCell==='cell'+user.id && Object.keys(user.sundayShifts)!=0 &&(
                <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                    

                  {Object.keys(user.sundayShifts).map(key=>

                    <p class="text-xs">{key}   ({user.sundayShifts[key]})</p>
                  )
                  }
          
                </div> 
          )}

        </td>
        <td>{user.plannedLeave}</td>
        <td>{user.unplannedLeave}</td>
        {user.holiday!==null  && (user.month=='Jan' || user.month=='May' || user.month=='Aug' || user.month=='Oct') && 
        (
          <td>✅</td>
        )}

        {user.holiday===null &&   (user.month=='Jan' || user.month=='May' || user.month=='Aug' || user.month=='Oct') && 
        (
            <td>❌</td>
        )}

        {access=='manager' && (
        <td class="flex flex-col"><button onClick={()=>handleDeleteClick()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
          </button>

        


        <button class="mt-2" onClick={()=>handleUpdateClick(user.employee)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
          </button>
        </td>
        )}
        {/* {showDialog && (
          <div class="fixed top-1/3 left-[420px] z-1000 border-solid ">
            <h2>Edit Employee Info's</h2>
            <form>
              <div>
                <label>Email: </label>
                <input style={{ 
          border: '1px solid #ccc', // Border color
          borderRadius: '4px', // Optional: Rounded corners
          padding: '8px', // Optional: Padding
          width: '200px',
          height:'30px' // Optional: Width
        }} type="text" name="email" value={formData.email} onChange={handleChange} placeholder='Enter Email'></input>
              </div>

              <div class="mt-2">
                <label>Id: </label>
                <input style={{ 
          border: '1px solid #ccc', // Border color
          borderRadius: '4px', // Optional: Rounded corners
          padding: '8px', // Optional: Padding
          width: '200px',
          height:'30px' // Optional: Width
        }} type="id" name="id" value={formData.id} onChange={handleChange} placeholder='Enter Id'></input>
              </div>

              <button class="w-20 ml-4 border-box bg-green-300 rounded" type="button" onClick={handleUpdateUser}>Update</button>
            <button class="ml-10 w-20 bg-red-500 rounded" type="button" onClick={handleCloseDialog}>Cancel</button>
            </form>


          </div>

        )} */}


<Dialog open={deleteConfirmation} maxWidth="md">
          <DialogTitle>
            Are you sure you want to delete this employee permanently?
          </DialogTitle>

          <DialogContent>

            <Modal.Footer class="">
              <Button variant="Secondary" onClick={handleDeleteCancel}>Cancel</Button>
              <Button  color='primary' onClick={handleDelete}>Delete</Button>

            </Modal.Footer>
          </DialogContent>

        </Dialog>


        <Dialog open={showDialog} maxWidth="md">
          <DialogTitle>
            Edit Employee's Info
          </DialogTitle>

          <DialogContent>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control name='email' type="email" value={formData.email} onChange={handleChange}>
                  
                </Form.Control>
            </Form.Group>
            {!vaildEmail && (
                    <p>Email is not valid</p>
                  )}
            <Form.Group class="mt-6">
                <Form.Label>Employee Id</Form.Label>
                
                <Form.Control name='id' type="text"  value={formData.id} onChange={handleChange}></Form.Control>
            </Form.Group>

            {/* <Form.Group class="mt-6">
                <Form.Label>Employee Department</Form.Label>
                
                <Form.Control name='dept' type="text"  value={formData.dept} onChange={handleChange}></Form.Control>
            </Form.Group> */}
            {<p>{validId}</p>}
            <Modal.Footer class="">
              <Button variant="Secondary" onClick={handleCloseDialog}>Cancel</Button>
              <Button  color='primary' onClick={handleUpdateUser}>Update</Button>

            </Modal.Footer>

          </DialogContent>

        </Dialog>


  

        </tr> 

  </tbody>
  
      {/* {users.map(user=>(      
        
        <tr>
        <td>{user.id}</td>
        <td>{user.employeeName}</td>
        <td>{user.morningShiftCount}</td>
        <td>{user.afternoonShiftCount}</td>
        <td>{user.nightShiftCount}</td>
        <td>{user.totalCount}</td>
        <td>₹ {user.totalMoney}</td>
        <td onMouseOver={()=>handleCellHover('cell'+user.id)} onMouseOut={(handleCellLeave)}>{user.sundayCount}
          {hoveredCell==='cell'+user.id && Object.keys(user.sundayShifts)!=0 &&(
                <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                    

                  {Object.keys(user.sundayShifts).map(key=>

                    <p class="text-xs">{key}   ({user.sundayShifts[key]})</p>
                  )
                  }

                </div> 
          )}

        </td>
        <td>{user.plannedLeave}</td>
        <td>{user.unplannedLeave}</td>
        </tr>
      ))} */}
  
  
</table>

    </div>
  )
}

export default Employee
