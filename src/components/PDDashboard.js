import React from 'react'
import { useEffect, useRef, useState } from 'react';
import {Dialog, DialogContent } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import sfit from '../images/sfit.png'
import bzd from '../images/bzd.png'
import FSK from '../images/FSK.png'
import mes from '../images/mes.jpg'
import smos from '../images/smos.png'
import samt from '../images/samt.png'
import samt2 from '../images/samt2.png'
import maximo from '../images/maximo.png'
import {useNavigate} from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useParams, redirect } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogTitle from '@mui/material/DialogTitle';
import volkslogo from '../images/volkslogo.png'
import {Navbar,NavbarItem} from './Navbar'
import { Calendar, Flag, FlagIcon, Home, Layers, LayoutDashboard, LifeBuoy, Settings, Sidebar, StickyNote } from 'lucide-react'
import { useGlobal } from './GlobalContext';

export let edit=true;

const PDDashboard = () => {
  const{access}=useParams();

  const[hoveredProfileIcon,setHoveredProfileIcon]=useState(false);

  const[activeItem,setActiveItem]=useState(null);
  const[users,setUsers]=useState([]);
  const[viewMonth,setViewMonth]=useState(null);
  const[department,setDepartment]=useState("");

  // let department="";

  // const valueRef=useRef(department);

  const[openEdit,setOpenEdit]=useState(false);
  const[shift,setShift]=useState("");

  const[openWork_Oncall,setOpenWork_Oncall]=useState(false);
  const[open_on_call_edit,set_open_on_call_edit]=useState(false);

  const[editUser,setEditUser]=useState({});

  const[open_comment,set_open_comment]=useState(false);
  const[comment,set_comment]=useState("");
  const[openSubstitute,setOpenSubstitute]=useState(false);
  const[openSundayEdit,setOpenSundayEdit]=useState(false);

  const[pl_upl_edit,set_pl_upl_edit]=useState(false);

  const[num,setNum]=useState('');
  const[type_of_shift,setType_of_Shift]=useState('');

  const[hoveredCell_subs,setHoveredCell_subs]=useState(false);
  const[hovered_user,setHovered_User]=useState({});

  const[hoveredCell, setHoveredCell]=useState(null);

  const[hoveredCell_oncall,setHoveredCell_oncall]=useState(false);
  const[hoveredCell_workoff,setHoveredCell_workoff]=useState(false); 
  
  const[hoveredCell_pl,setHoveredCell_pl]=useState(false);
  const[hoveredCell_upl,setHoveredCell_upl]=useState(false);

  const[substituteDate,setSubstituteDate]=useState("");
  const[substituteMonth,setSubstituteMonth]=useState("");

  const[selectedFile,setSelectedFile]=useState(null);
  const[isFileSelected,setIsFileSelected]=useState(null);

  const navigate=useNavigate();


  const handleRestDaySubstitute=async()=>{
    try {
      await axios.put(
        `http://localhost:8084/api/shift/update/subs/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&department=${department}&date=${substituteDate}${"-"}${substituteMonth}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
    } catch (error) {
      console.log(error);
    }
   
    setOpenSubstitute(false);
    setSubstituteDate("");
    setSubstituteMonth("");
  }

  const handleCellHover_pl=(cellId,user)=>{
    setHoveredCell_pl(cellId);
    setHovered_User(user);


  }

  const handleCellLeave_pl=(cellId)=>{
    setHoveredCell_pl(null);
    setHoveredCell_pl(null);

  }


  const handleCellLeave_upl=(cellId)=>{
    setHoveredCell_upl(null);
    setHoveredCell_upl(null);

  }

  const handleCellHover_oncall=(cellId)=>{
    setHoveredCell_oncall(cellId);
  }

  const handleCellLeave_oncall=(cellId)=>{
    setHoveredCell_oncall(null);
  }

  const handle_open_on_call=(user,shiftType)=>{
    set_open_on_call_edit(true);
    setEditUser(user);
    setShift(shiftType);
  }
  const handleCellHover_workoff=(cellId)=>{
    setHoveredCell_workoff(cellId);
  }

  const handleCellLeave_workoff=(cellId)=>{
    setHoveredCell_workoff(null);
  }

  const handleOpenEdit_Work_Oncall=(user,shiftType)=>{
    setOpenWork_Oncall(true);
    setEditUser(user);
    setShift(shiftType);
  }
  const handle_comment=(user)=>{
    set_open_comment(true);
    setEditUser(user);
  }

  
  const handleCellHover_upl=(cellId,user)=>{
    setHoveredCell_upl(cellId);
    setHovered_User(user);
  }


  const changeSubstitueMonth=(event)=>{
    setSubstituteMonth(event.target.value);
  }

  const changeSubstitueDate=(event)=>{
    setSubstituteDate(event.target.value);
  }


  const handleCellLeave_subs=(cellId)=>{
    setHoveredCell_subs(null);
    setHoveredCell_subs(null);
  }

  const handleOpenSunday=(user)=>{
    setOpenSundayEdit(true);
    setEditUser(user);
  }

  const handleTypeOfShift=(event)=>{
    setType_of_Shift(event.target.value);
  }

  const handleSundaySave=async()=>{
    try {
      await axios.put(
        `http://localhost:8084/api/shift/update/sunday/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&date=${num}${"-"}${viewMonth.substring(0,3)}&department=${department}&shiftType=${type_of_shift}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
    } catch (error) {
      console.log(error);
    }

    setOpenSundayEdit(false);
  }

  const handleOpenSubstitue=(user)=>{
    setOpenSubstitute(true);
    setEditUser(user);

  }

  const handleCellLeave=()=>{
    setHoveredCell(null);
  }

  const handleCellHover=(cellId)=>{
    setHoveredCell(cellId);
  }
  const handleNumEdit=(event)=>{
    setNum(event.target.value);
  }

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8084/api/shift/update/${shift}/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&department=${department}&count=${num}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );
      
      fetchData(viewMonth);
    } catch (error) {
      console.log(error);
    }
   
    setOpenEdit(false);
  }

  const update_comment=(event)=>{
    set_comment(event.target.value);
  }

  const handleCommentSave=async()=>{
    try{
      await axios.put(`http://localhost:8084/api/shift/update/comment/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&comment=${comment}&department=${department}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
    }catch(error)
    {
      console.log(error);
    }

    set_open_comment(false);
    set_comment("");
  }

  const handleCellHover_subs=(cellId,user)=>{
    setHoveredCell_subs(cellId);
    setHovered_User(user);
    console.log(hoveredCell_subs);
  }

  const handleBillable=(user)=>{
    if(user.allowanceBillable==="Yes")
    {
      axios.put(
        `http://localhost:8084/api/shift/update/bill/${user.employee.employeeName}?month=${viewMonth}&year=${viewYear}&department=${department}&billable=No`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
      
    }

    else
    {
      axios.put(

        `http://localhost:8084/api/shift/update/bill/${user.employee.employeeName}?month=${viewMonth}&year=${viewYear}&department=${department}&billable=Yes`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )

      
    }

    fetchData(viewMonth);
  }

  const handle_pl_upl_edit=(user,shiftType)=>{
    set_pl_upl_edit(true);
    setEditUser(user);
    setShift(shiftType);
  }

  async function fetchData(month){
    
    try{
      setViewMonth(month);
      // users.splice(0,users.length);
      const response=await fetch('http://localhost:8084/api/shift/all?month='+month+'&year='+viewYear+"&department="+department,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      const jsonData=await response.json();
      console.log(jsonData);
      setUsers(jsonData);
    }
    catch(error)
    {
      console.error('Error fetching data: ',error);
    }

  }

  users.map(user=>(
    user.totalCount=user.afternoonShiftCount+user.morningShiftCount+user.nightShiftCount+user.general+user.plannedLeave+user.unplannedLeave
  ));

  users.sort((a,b)=>{
    if(a.employee.employeeName<b.employee.employeeName)
      {
        return -1;
      }

    if(a.employee.employeeName>b.employee.employeeName)
      {
        return 1;
      }

      return 0;
  })

  const handleOpenEdit=(user,shiftType)=>{
    setOpenEdit(true);
    setEditUser(user);
    setShift(shiftType);
  }

  

  const fileSelectedHandler=event=>{
    setSelectedFile(event.target.files[0]);
    setIsFileSelected(true);
  };

  const currentMonth=new Date().toLocaleString('default', { month: 'long' })

  const[isUploadPopUpOpen,setIsUploadPopUpOpen]=useState(false);
  const[uploadMonth,setUploadMonth]=useState(currentMonth);
  const[uploadYear,setUploadYear]=useState(new Date().getFullYear());
 

  const currentYear=new Date().getFullYear();

  const yearsArray=Array.from({length:10},(_,index)=>currentYear-index);



  const handleUploadMonth=(event)=>{
    setUploadMonth(event.target.value);
  }

  const handle_pl_upl = async () => {
    try {
      await axios.put(
        `http://localhost:8084/api/shift/update/${shift}/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&date=${num}${" "}${viewMonth}&department=${department}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
    } catch (error) {
      console.log(error);
    }
   
    set_pl_upl_edit(false);
  }

  const handleSaveOnCallOnWorkOff=async()=>{
    try {
      await axios.put(
        `http://localhost:8084/api/shift/update/${shift}/${editUser.employee.employeeName}?month=${viewMonth}&year=${viewYear}&date=${num}${"-"}${viewMonth}&hoursWorked=${type_of_shift}&department=${department}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

      fetchData(viewMonth);
    } catch (error) {
      console.log(error);
    }
   
    setOpenWork_Oncall(false);
    set_open_on_call_edit(false);
  }

  const handleUploadYear=(event)=>{
    setUploadYear(event.target.value);
  }

  const[uploading,setUploading]=useState(null);
  const[uploadError,setUploadError]=useState(null);


  const fileUploadHandler=async()=>{
    try{
      setUploading(true);
      const formData=new FormData();
      formData.append('file',selectedFile);

      const response=await axios.post('http://localhost:8084/api/shift/upload?'+"month="+uploadMonth+"&year="+uploadYear+"&department="+department,formData,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }
  
      );

      console.log('File Uploaded successfully');

      setIsUploadPopUpOpen(false);
      setSelectedFile(null);
      setIsFileSelected(null);
      setUploading(false);
      setUploadError(null);
    }

    catch(error){
      console.error('Error uploading file: ',error);
      setUploadError('Error uploading file. Please try again.');
      setUploading(false);
    }
  };


  const handleEditCancel=()=>{
    setOpenEdit(false);
    setOpenWork_Oncall(false);
    set_open_on_call_edit(false);
    set_pl_upl_edit(false);
    set_open_comment(false);
    setOpenSubstitute(false);
    setOpenSundayEdit(false);
    setIsUploadPopUpOpen(false);
  }

  const toggleUploadPopup=()=>{
    setIsUploadPopUpOpen(!isUploadPopUpOpen);
  }

  const[viewYear,setViewYear]=useState("View Year");

  const handleViewYear=(value)=>{
    setViewYear(value);
  }

  const containerRef=useRef(null);

  const scrollLeft=()=>{
    if(containerRef.current)
      {
        containerRef.current.scrollBy({
          left:-200,
          behavior:'smooth'
        });
      }
  }

  const scrollRight=()=>{
    if(containerRef.current)
      {
        containerRef.current.scrollBy({
          left:200,
          behavior:'smooth'
        });
      }
  }
  
  
  const getRowClass=(count,working)=>{

    if(count>working || count<working)
    {
      return 'table-danger';
    }

    return "";
  };


  const[checked,setChecked]=useState(false);

 

  const handleLogOut=()=>{
    console.log('Logging Out');
    sessionStorage.removeItem('token');
    navigate('/');
  }



  const handleChange=async(event)=>{
  
    setChecked(event.target.checked);
    try {
       await axios.post(
        `http://localhost:8084/api/toggle/toggleValue`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );

    }
    
    catch(error)
    {
      console.log(error);
    }
  }

  const Project=()=> 
          
  <div class="flex-col mr-4">
        <div class="py-4 mx-[280px] inline font-semibold text-[35px]">{department} {viewMonth} {viewYear}</div>

  <div class="flex">

  <div class="">
  

<div class="flex ml-0 border-black bg-volks text-white rounded justify-start">
<h6 class="p-2">Edit</h6>
<Switch 
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    </div>


    <div class="dropdown my-0 ml-0">
              <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
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
</div>

<div class="bg-white  max-w-3xl my-0 mx-10  rounded overflow-hidden relative flex border-solid border-2">
  <button onClick={scrollLeft} class="h-full w-18 flex items-center top-0">
      <svg class="text-gray w-6 h-6 mt-[6px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
  </button>
  
  <ul ref={containerRef} class="flex gap-x-4 py-3 px-4 m-0 mt-2 overflow-x-scroll scrollbar-hide">
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

    <li class="cursor-pointer" onClick={()=>fetchData("July")}>
      <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">July </a>
    </li>

    <li class="cursor-pointer" onClick={()=>fetchData("August") }>
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

  <button onClick={scrollRight} class="right-0 items-center justify-end top-0">

  <svg class="w-6 h-6 mt-[20px] text-gray mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>


  </button>

</div> 
<button onClick={toggleUploadPopup} style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative px-2 my-4 mr-4 h-1/2" type="button" id="" data-bs-toggle="" aria-expanded="false">Upload</button>       

<Dialog open={isUploadPopUpOpen} maxWidth="sm">
          <DialogTitle>
            Upload the File
          </DialogTitle>

          <DialogContent>

          <Form.Group>
                <Form.Label>Year</Form.Label>
          </Form.Group>

        <Form.Select  style={{ textAlign: 'center' }} size="sm" onChange={handleUploadYear}>
         
              
          {yearsArray.map((item,index)=>(
            <option class="justify-center items-center hover:bg-black" key={index} value={item}>{item}</option>
            
          ))}
        
        </Form.Select>


        <Form.Group style={{ textAlign: 'center', width:'30px' }} size='sm'>
                <Form.Label>Month</Form.Label>
          </Form.Group>


          <Form.Select value={uploadMonth} style={{ textAlign: 'center' }} size="sm" onChange={handleUploadMonth}>
          <option >January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </Form.Select>


        <Form.Group>
                <Form.Label>Choose File</Form.Label>
        </Form.Group>
          
        <Form.Control type="file" onChange={fileSelectedHandler}/>  

            <Modal.Footer class="py-2">
              <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
              <Button color='primary' onClick={fileUploadHandler}>Save</Button>
            </Modal.Footer>
          </DialogContent>
        </Dialog>

</div>



</div>
  const[selectedOption,setSelectedOption]=useState("");

  const renderContent=()=>{
    switch(selectedOption){
      case 'Project':
        return <Project/>;
      
    }
  }

  const toggleItem=(item)=>{
    if(activeItem===item)
    {
      setActiveItem(null);
    }

    else
    {
      setActiveItem(item);
    }

    setSelectedOption("Project");
  }

  const [showTable, setShowTable] = useState(false);

  const sectionRef=useRef(null);

  const handleBoxClick=()=>{
    setShowTable(true);
    setShowDashboard(false);

    if(sectionRef.current)
    {
      sectionRef.current.scrollIntoView({
        behavior:'smooth',
        block:'end'
      })
    }
  }



  const handleDownload=async()=>{
    try {

      const response = await axios.get('http://localhost:8084/api/shift/download?month='+viewMonth+'&year='+viewYear+'&departmentName='+department, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Allowance_'+department+'_'+viewMonth+'_'+viewYear+'.xlsx'; // You can specify a custom file name
      link.click(); 

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading the Excel file:', error);
    }
    }

    const[showDashboard,setShowDashboard]=useState(true);

    const handleClose=()=>{
      setShowTable(false);
      setShowDashboard(true);
      setUsers([]);
      setViewYear("View Year");
      setViewMonth(null);
    }

  return (
    <div>
      <div class="bg-volks  left-0 top-0 h-20 pt-2 flex flex-row w-full">
        <div class="w-2/12 ml-10 h-2">
          <img class="h-11 w-52" src={volkslogo} alt=""></img>
        </div>

        <div class="relative inline-block text-left">
  <div class="ml-8 bg-volks">
    <button onClick={handleLogOut} type="button" class="border-hidden hover:bg-black inline-flex w-full justify-center gap-x-1.5 rounded-md bg-volks px-3 py-2 text-sm font-semibold text-white   cursor-pointer" id="menu-button" aria-expanded="true" aria-haspopup="true">
      Log Out
     
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


      <svg onMouseOver={()=>setHoveredProfileIcon(true)} onMouseOut={()=>setHoveredProfileIcon(false)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="ml-8 bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
      </svg>
      </div>

      {hoveredProfileIcon && (
        <div class="text-white text-sm absolute right-28 my-8">SuperAdmin</div>
      )}
      
      
      </div>

      


      {/* <div class="align-center justify-center mt-20 ml-[300px]">{renderContent()}</div>
      
      
      <div class="flex min-h-screen">
      <div class="w-64 flex fixed bottom-0 top-20 left-0"> */}
      {/* <Navbar> */}
        {/* <NavbarItem icon={<Home size={30}/>} text="Home" ></NavbarItem> */}
        {/* <NavbarItem icon={<LayoutDashboard size={30}/>} text="Dashboard" ></NavbarItem> */}
        {/* <NavbarItem icon={<StickyNote size={30} onClick={()=>toggleItem('item1')} />}  text="Projects" ></NavbarItem>
        {
          activeItem==='item1' && (
            <ul>
              <li class="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={()=>setDepartment("SFIT")}>SFIT</li>
              <li class="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={()=>setDepartment("MES")}>MES</li>
            </ul>
          )
        } */}
        {/* <NavbarItem icon={<Calendar size={30}/>} text="Calendar" ></NavbarItem>
        <NavbarItem icon={<Layers size={30}/>} text="Tasks" ></NavbarItem> */}
        {/* <NavbarItem icon={<Flag size={30}/>} text="Reporting" ></NavbarItem> */}

        {/* <hr class="my-3"/> */}
      {/* </Navbar>  */}
      
      {/* </div>
      </div> */}


{/* <h1 class="ml-[350px] mt-8 ">Shift Allowance Dashboard</h1> */}
<img class="ml-24" src={samt2}></img>
  {showDashboard && (
    
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 py-2 mt-2">
      
    <div
        class="image-box group relative hover:shadow-2xl"
        onClick={handleBoxClick}
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize:'large'
        }}
      >
      <div class="w-full h-full" onClick={()=>setDepartment("SFIT")}>
      
      <img class="w-full h-full" src={sfit}></img>
      
      
      </div>  

        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
  
      </div>



    <div
        className="image-box hover:shadow-2xl"
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize:'large'
        }}
        onClick={handleBoxClick}>
        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
      <div class="w-full h-full" onClick={()=>setDepartment("MES")}>

          <img class="w-full h-full" src={mes}></img>
      </div>
      
      
      </div>
          

    <div
        className="image-box hover:shadow-2xl"
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}

<div class="w-full h-full">

<img class="w-full h-full" src={FSK}></img>


</div>  

      </div>



      <div
        className="image-box hover:shadow-2xl"
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
           <div class="w-full h-full">
           
           <img class="w-full h-full" src={bzd}></img>
           </div>  

      </div>

      <div
        class="image-box group relative hover:shadow-2xl"
        onClick={handleBoxClick}
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize:'large'
        }}
      >
      <div class="w-full h-full">
        
      <img class="w-full h-full" src={maximo}></img>
        
        </div>  

        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
  
      </div>

      <div
        className="image-box hover:shadow-2xl"
        style={{
          width: '400px',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        {/* <img
          src="https://via.placeholder.com/300x200"
          alt="Click to fetch data"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
            <div class="w-full h-full" >
              
            <img class="w-full h-full" src={smos}></img>
              </div>  

      </div>
    
      </div>)}
      
      {showTable && (

        <><>
<div onClick={handleClose} class="border w-24 bg-volks text-white h-10 p-2 rounded flex flex-row cursor-pointer"> 
  
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="" fill="currentColor" class="bi bi-arrow-left mt-[1px] mx-1" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg>
  
  <p class="mb-1">Home</p></div>
<div class="mt-12 flex">

<div class="flex flex-row">
<div>
<div class="dropdown mt-0 ml-0 ">
              <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
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

<div class="flex ml-0 w-24 border-black bg-volks text-white rounded justify-start">
<h6 class="p-2">Edit</h6>
<Switch 
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    </div>
    </div>
      
  <div class="bg-white max-w-3xl ml-48 justify-center rounded overflow-hidden relative flex border-solid border-2">
  <button onClick={scrollLeft} class="h-full w-18 flex items-center top-0">
      <svg class="text-gray w-6 h-6 mt-[6px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
  </button>
  
  <ul ref={containerRef} class="flex gap-x-4 py-3 px-4 m-0 mt-2 overflow-x-scroll scrollbar-hide">
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

    <li class="cursor-pointer" onClick={()=>fetchData("July")}>
      <a class="text-white border-solid border-2 no-underline bg-volks py-1 px-6 inline-block rounded hover:bg-volks">July </a>
    </li>

    <li class="cursor-pointer" onClick={()=>fetchData("August") }>
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

  <button onClick={scrollRight} class="right-0 items-center justify-end top-0 mt-2">

  <svg class="w-6 h-6 mt-[20px] text-gray mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
  </button>




</div> 




<div class="mx-12">
    <button onClick={handleDownload} type="button" class="btn btn-success float-right">Download</button> 
  </div> 

</div>



</div>

<div class="mt-4 flex justify-center"><h1>{department} {viewMonth} {viewYear.length!==0 && viewYear} Shift</h1></div>
        </><table class="table table-bordered border-gray-300 mt-4" id="datatable">
            <thead class="text-center">
              <tr>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Employee Id</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Employee Name </th>
                <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">General</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Morning</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">AfterNoon</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Night</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Total</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Billable Project DLV (YES/NO)</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Allowance(INR)</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Rest Day</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Substitue Rest Day</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Rest Day Dates</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">Planned Leave</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope='col'>Unplanned Leave</th>
                {viewMonth === 'Jan' && <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">National Holiday (26th Jan)</th>}
                {viewMonth === 'May' && <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">National Holiday (1st May)</th>}
                {viewMonth === 'Aug' && <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">National Holiday (15th Aug)</th>}
                {viewMonth === 'Oct' && <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope="col">National Holiday (2nd Oct)</th>}
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope='col'>On Call(In Hrs)</th>
                {/* <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>On Call Dates</th> */}
                {/* <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Work Off Dates</th> */}
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope='col'>Work Off</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white', display: 'none' }} scope='col'>Work Off Dates</th>
                <th style={{ backgroundColor: '#5f1939', color: 'white' }} scope='col'>Comments(if any)</th>

              </tr>
            </thead>

            <tbody class='text-center'>
   {users.map((user,index)=>(    
     
     <tr key={index} className={getRowClass(user.totalCount,user.workingDays)}>
     <td>{user.employee.employeeId}</td>
     <td class="cursor-pointer origin-center text-left hover:shadow-inner hover:shadow-volks">{user.employee.employeeName}</td>
     <td>{user.general}  </td>
     <td>{user.morningShiftCount}  </td>
     <td>{user.afternoonShiftCount}  </td>
     <td>{user.nightShiftCount} </td>
     <td>{user.totalCount}</td>
     <td>{user.allowanceBillable} </td>
     <td>₹ {user.totalMoney}</td>
     
     <Dialog open={openEdit} maxWidth="md">
       <DialogTitle>
         Enter the new number?
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Days</Form.Label>
             <Form.Control name='days'  type="number"  onChange={handleNumEdit}></Form.Control>
       </Form.Group>

         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleSave}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>

     <Dialog open={open_comment} maxWidth="md">
       <DialogTitle>
         Add Comment
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Comment</Form.Label>
             <Form.Control name='days'  type="text"  onChange={update_comment}></Form.Control>
       </Form.Group>

         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleCommentSave}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>



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

     <Dialog open={openSundayEdit} maxWidth="md">
       <DialogTitle>
         Enter the new number?
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Date</Form.Label>
             <Form.Control name='days'  type="number"  onChange={handleNumEdit}></Form.Control>
       </Form.Group>

       <Form.Group>
             <Form.Label>Shift Type</Form.Label>
             <Form.Control name='days'  type="text" onChange={handleTypeOfShift}></Form.Control>
       </Form.Group>



         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleSundaySave}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>


     <td onMouseOver={()=>handleCellHover_subs('cell'+user.id)} onMouseOut={(handleCellLeave_subs)}>{user.subRestDays.length}
     
       {hoveredCell_subs==='cell'+user.id && Object.keys(user.subRestDays.length)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.subRestDays).map(key=>

                 <p class="text-xs">{user.subRestDays[key]}</p>)}
           
             </div> 
       )}
     </td>

<td class="text-xs" onMouseOver={()=>handleCellHover_subs('cell'+user.id,user)} onMouseOut={(handleCellLeave_subs)}>
{ user.subRestDays.map((text,index)=>(
 <div key={index} class="py-1">{text}</div>
))}

{hoveredCell_subs==='cell'+user.id && Object.keys(user.subRestDays.length)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
         
               {Object.keys(user.subRestDays).map(key=>
                 
                 <p class="text-xs">({user.subRestDays[key]})</p>)
                 
                 }
           
             </div> 

             
       )}
     </td>


   
       
     <Dialog open={openSubstitute} maxWidth="md">
       <DialogTitle>
         Add Substitue Rest Day 3 <br/>
         days before or after the taken rest day 
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Date</Form.Label>
             <Form.Control name='days'  type="number"  onChange={changeSubstitueDate}></Form.Control>
       </Form.Group>

       <Form.Group>
             <Form.Label>Month</Form.Label>
             <Form.Control name='days'  type="text"  onChange={changeSubstitueMonth}></Form.Control>
       </Form.Group>

         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleRestDaySubstitute}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>

     <td class="hidden">{Object.keys(user.sundayShifts)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.sundayShifts).map(key=>

                 <p class="text-xs">({user.sundayShifts[key]})</p>
               )
               }
             </div> 
       )}</td>
     <td onMouseOver={()=>handleCellHover_pl('cell'+user.id,user)} onMouseOut={(handleCellLeave_pl)}>
       {user.plannedLeaveDates.length}
     {hoveredCell_pl==='cell'+user.id && (user.plannedLeaveDates.length)!=0 &&(
             <div id="movableDiv" className="text-xs rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2 ">  
               

       {Object.keys(user.plannedLeaveDates).map(key=>
       <p class="text-xs">{user.plannedLeaveDates[key]}</p>)}
               </div> 
       )}
     </td>
     <td onMouseOver={()=>handleCellHover_upl('cell'+user.id,user)} onMouseOut={(handleCellLeave_upl)}>

     {hoveredCell_upl==='cell'+user.id && (user.unplannedLeaveDates.length)!=0 &&(
             <div id="movableDiv" className="text-xs rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2 ">  
               

       {Object.keys(user.unplannedLeaveDates).map(key=>
       <p class="text-xs">{user.unplannedLeaveDates[key]}</p>)}
               </div> 
       )}

     </td> 
             
     {user.holiday!==null  && (viewMonth=='Jan' || viewMonth=='May' || viewMonth=='Aug' || viewMonth=='Oct') && 
     (
       <td>✅</td>
     )}

     {user.holiday===null &&   (viewMonth=='Jan' || viewMonth=='May' || viewMonth=='Aug' || viewMonth=='Oct') && 
     (
         <td>❌</td>
     )}
     <td onMouseOver={()=>handleCellHover_oncall('cell'+user.id)} onMouseOut={(handleCellLeave_oncall)}>{user.onCallCount}
     {hoveredCell_oncall==='cell'+user.id && Object.keys(user.onCallShifts)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.onCallShifts).map(key=>

                 <p class="text-xs">{key}   ({user.onCallShifts[key]})</p>
               )
               }
             </div> 
       )}

     </td>

     <td class="hidden">{Object.keys(user.onCallShifts)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.onCallShifts).map(key=>

                 <p class="text-xs">{key}   ({user.onCallShifts[key]})</p>
               )
               }
             </div> 
       )}</td>

     <td onMouseOver={()=>handleCellHover_workoff('cell'+user.id)} onMouseOut={(handleCellLeave_workoff)}>{user.workOffCount} 

     {hoveredCell_workoff==='cell'+user.id && Object.keys(user.workOffShifts)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.workOffShifts).map(key=>

                 <p class="text-xs">{key}   ({user.workOffShifts[key]})</p>
               )
               }
             </div> 
       )}
     </td>

<td class="hidden">{Object.keys(user.workOffShifts)!=0 &&(
             <div id="movableDiv" className="rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2">
                 

               {Object.keys(user.workOffShifts).map(key=>

                 <p class="text-xs">{key}   ({user.workOffShifts[key]})</p>
               )
               }
             </div> 
       )}</td>
     
     <td>{user.comment}</td>

     <Dialog open={pl_upl_edit} maxWidth="md">
       <DialogTitle>
         Enter the new number?
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Days</Form.Label>
             <Form.Control name='days'  type="number"  onChange={handleNumEdit}></Form.Control>
       </Form.Group>

         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handle_pl_upl}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>

     <Dialog open={open_on_call_edit} maxWidth="md">
       <DialogTitle>
         Enter the new number?
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Date</Form.Label>
             <Form.Control name='days'  type="number"  onChange={handleNumEdit}></Form.Control>
       </Form.Group>

       <Form.Group>
             <Form.Label>Hours</Form.Label>
             <Form.Control name='days'  type="number" onChange={handleTypeOfShift}></Form.Control>
       </Form.Group>



         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleSaveOnCallOnWorkOff}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>

     <Dialog open={openWork_Oncall} maxWidth="md">
       <DialogTitle>
         Enter the new number?
       </DialogTitle>

       <DialogContent>

       <Form.Group>
             <Form.Label>Date</Form.Label>
             <Form.Control name='days'  type="number"  onChange={handleNumEdit}></Form.Control>
       </Form.Group>

       <Form.Group>
             <Form.Label>Hours</Form.Label>
             <Form.Control name='days'  type="text" onChange={handleTypeOfShift}></Form.Control>
       </Form.Group>



         <Modal.Footer class="">
           <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
           <Button color='primary' onClick={handleSaveOnCallOnWorkOff}>Save</Button>
         </Modal.Footer>
       </DialogContent>
     </Dialog>


     </tr>
   ))}
          </tbody>
          </table></>
      )}



    </div>
    
  )
}

export default PDDashboard
