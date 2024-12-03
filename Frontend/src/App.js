import { useEffect, useRef, useState } from 'react';
import './App.css';
import Modal from 'react-bootstrap/Modal';
import {  Dropdown } from 'bootstrap';
import Employee from './components/Employee';
import FormSelect from 'react-bootstrap/FormSelect'
import { BrowserRouter as Router, Route, Switch, Routes, Link, Navigate, useParams, redirect } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import {Dialog, DialogContent } from '@mui/material';
import Form from 'react-bootstrap/Form';
import DialogTitle from '@mui/material/DialogTitle';
import {department} from './components/Login';
import volkslogo from './images/volkslogo.png'
import balnkprofile from './images/blank-profile.webp'
import { TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { GlobalProvider, useGlobal } from './components/GlobalContext';
import ReactDOM from 'react-dom';
import {edit} from './components/PDDashboard'

function App() {

  const{access}=useParams();
  const handleEmployeeClick=(value)=>{
   //window.open('src\components\Employee.js',value,'_blank');
   //window.open(navigate(`/employee/${value}`));
    // window.open(`/employee/${value}/${viewMonth}/${viewYear}/${access}`);
    // <Redirect to="/employee/${value}/${viewMonth}/${viewYear}/${access}"/>;
    window.open(`/employee/${value}/${viewMonth}/${viewYear}/${access}/${department}`);
  }

  const[hoveredProfileIcon,setHoveredProfileIcon]=useState(false);

  const[edit,setEdit]=useState(null);
  
  const[viewMonth,setViewMonth]=useState(null);
  const[viewYear,setViewYear]=useState("View Year");

  const[users,setUsers]=useState([]);

  const[editUser,setEditUser]=useState({});
  const[shift,setShift]=useState("");

  const navigate=useNavigate();

  const[openEdit,setOpenEdit]=useState(false);
  const[openWork_Oncall,setOpenWork_Oncall]=useState(false);


  const[hovered_user,setHovered_User]=useState({});



  const[open_on_call_edit,set_open_on_call_edit]=useState(false);
  const[on_call_hours,set_on_call_hours]=useState(0);
  

  const[openSundayEdit,setOpenSundayEdit]=useState(false);

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

  const handleOpenSunday=(user)=>{
    setOpenSundayEdit(true);
    setEditUser(user);
  }

  const handle_open_on_call=(user,shiftType)=>{
    set_open_on_call_edit(true);
    setEditUser(user);
    setShift(shiftType);
  }


  const handleOpenEdit=(user,shiftType)=>{
    setOpenEdit(true);
    setEditUser(user);
    setShift(shiftType);
  }

  const handleOpenEdit_Work_Oncall=(user,shiftType)=>{
    setOpenWork_Oncall(true);
    setEditUser(user);
    setShift(shiftType);
  }


  const[pl_upl_edit,set_pl_upl_edit]=useState(false);
  const handle_pl_upl_edit=(user,shiftType)=>{
    set_pl_upl_edit(true);
    setEditUser(user);
    setShift(shiftType);
  }


  const[open_comment,set_open_comment]=useState(false);
  const[comment,set_comment]=useState("");

  const handle_comment=(user)=>{
    set_open_comment(true);
    setEditUser(user);
  }

  const update_comment=(event)=>{
    set_comment(event.target.value);
  }


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


  const editPower=async()=>{
    try
    {
      const response=await fetch('http://localhost:8084/api/toggle/currentValue',{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })

      const data=await response.json();
      
      setEdit(data);
    }
    catch(error)
    {
      console.log(error);
    }
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

  const[selectDate,setSelectedDate]=useState('');

  const handleDateInput=(event)=>{
    console.log("handle date called");
    console.log(event);

    // setSelectedDate(event.target);
    // console.log(selectDate);
  }



  const[num,setNum]=useState('');
  const[type_of_shift,setType_of_Shift]=useState('');

  const handleNumEdit=(event)=>{
    setNum(event.target.value);
  }

  const handleTypeOfShift=(event)=>{
    setType_of_Shift(event.target.value);
  }



  const handleLogOut=()=>{
    console.log('Logging Out');
    sessionStorage.removeItem('token');
    navigate('/');
  }


  const handleViewMonth=(value)=>{
    setViewMonth(value);
    fetchData();
  }

  const handleViewYear=(value)=>{
    setViewYear(value);
  }

  async function fetchData(month){
    
    try{
      setViewMonth(month);
      users.splice(0,users.length);
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

    editPower();

  }

  const[searchQuery,setSearchQuery]=useState('');
  const[employee,setEmployees]=useState(users);

  const handleSearchChange=event=>{
    setSearchQuery(event.target.value);
  }

  const filteredEmployees=employee.filter(employee=>employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));


  const currentMonth=new Date().toLocaleString('default', { month: 'long' })
  

  const[uploadMonth,setUploadMonth]=useState(currentMonth);
  const[uploadYear,setUploadYear]=useState(new Date().getFullYear());
  

  users.map(user=>(
    user.totalCount=user.afternoonShiftCount+user.morningShiftCount+user.nightShiftCount+user.general+user.plannedLeave+user.unplannedLeave
  ));


  for(let i=1;i<=users.length;i++)
  {
    users[i-1]['id']=i;
  }
  const handleUploadMonth=(event)=>{
    setUploadMonth(event.target.value);
  }


  const handleUploadYear=(event)=>{
    setUploadYear(event.target.value);
  }

 


  const[substituteDate,setSubstituteDate]=useState("");
  const[substituteMonth,setSubstituteMonth]=useState("");

  const[openSubstitute,setOpenSubstitute]=useState(false);

  const changeSubstitueDate=(event)=>{
    setSubstituteDate(event.target.value);
  }

  const changeSubstitueMonth=(event)=>{
    setSubstituteMonth(event.target.value);
  }

  const handleOpenSubstitue=(user)=>{
    setOpenSubstitute(true);
    setEditUser(user);

  }
  

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

  const[selectedFile,setSelectedFile]=useState(null);
  const[isFileSelected,setIsFileSelected]=useState(null);
  const[uploading,setUploading]=useState(null);
  const[uploadError,setUploadError]=useState(null);

  const fileSelectedHandler=event=>{
    setSelectedFile(event.target.files[0]);
    setIsFileSelected(true);
  };

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

      setSelectedFile(null);
      setIsFileSelected(null);
      setUploading(false);
      setUploadError(null);
      setIsUploadPopUpOpen(false);
    }

    catch(error){
      console.error('Error uploading file: ',error);
      setUploadError('Error uploading file. Please try again.');
      setUploading(false);
    }
  };

  const cancelUpload=()=>{
    setSelectedFile(null);
    setIsFileSelected(false);
    setUploadError(null);
  }


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
  

  const handleDownload=async()=>{
    try {
      // Authorization token (this should be dynamically retrieved from your auth system)
      
      
      // Sending a GET request to the API with Authorization header
      const response = await axios.get('http://localhost:8084/api/shift/download?month='+viewMonth+'&year='+viewYear+'&departmentName='+department, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        responseType: 'blob', // This ensures the response is treated as binary data (Excel file)
      });

      // Creating a blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Allowance_'+department+'_'+viewMonth+'_'+viewYear+'.xlsx'; // You can specify a custom file name
      link.click(); // Programmatically click the link to trigger the download

      // Cleanup: revoke the Object URL after the download is triggered
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading the Excel file:', error);
    }
    }
  

  const inputFile=useRef(null);

  const onButtonClick=()=>{
    inputFile.current.click();
  }

  const[isHovering,setIsHovering]=useState(false);
  const[hoveredCell, setHoveredCell]=useState(null);

  const[hoveredCell_oncall,setHoveredCell_oncall]=useState(false);
  const[hoveredCell_workoff,setHoveredCell_workoff]=useState(false); 
  
  const[hoveredCell_pl,setHoveredCell_pl]=useState(false);
  const[hoveredCell_upl,setHoveredCell_upl]=useState(false);

  const[hoveredCell_subs,setHoveredCell_subs]=useState(false);

  const handleCellHover_subs=(cellId,user)=>{
    setHoveredCell_subs(cellId);
    setHovered_User(user);
    console.log(hoveredCell_subs);
  }


  const handleCellLeave_subs=(cellId)=>{
    setHoveredCell_subs(null);
    setHoveredCell_subs(null);
  }

  const handleCellHover_pl=(cellId,user)=>{
    setHoveredCell_pl(cellId);
    setHovered_User(user);
  }

  

  const handleCellLeave_pl=(cellId)=>{
    setHoveredCell_pl(null);
    setHoveredCell_pl(null);

  }

  const handleCellHover_upl=(cellId,user)=>{
    setHoveredCell_upl(cellId);
    setHovered_User(user);
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

  const handleCellHover_workoff=(cellId)=>{
    setHoveredCell_workoff(cellId);
  }

  const handleCellLeave_workoff=(cellId)=>{
    setHoveredCell_workoff(null);
  }



  const handleCellHover=(cellId)=>{
    setHoveredCell(cellId);
  }

  const handleCellLeave=()=>{
    setHoveredCell(null);
  }
  

  const handleMouseOver=()=>{
    setIsHovering(true);
  }

  const handleMouseOut=()=>{
    setIsHovering(false);
  }

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
  

  // const maxCount=Math.max(...users.map(item=>item.totalCount));
  const getRowClass=(count,working)=>{

    if(count>working || count<working)
    {
      return 'table-danger';
    }

    return "";
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #ccc',
    padding: '20px',
    backgroundColor: 'white',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };
  const currentYear = new Date().getFullYear();
  const[isUploadPopUpOpen,setIsUploadPopUpOpen]=useState(false);


  const toggleUploadPopup=()=>{
    debugger;
    setIsUploadPopUpOpen(!isUploadPopUpOpen);
  }
  // const DateSelectorPopup = ({ onClose }) => {
  //   const currentYear = new Date().getFullYear();
  //   const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years
  //   const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1-12
  //   const departments = ['HR', 'Finance', 'Engineering', 'Marketing']; // Example departments
  
  //   const [selectedYear, setSelectedYear] = useState(years[0]);
  //   const [selectedMonth, setSelectedMonth] = useState(months[0]);
  //   const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  
    
  //   const handleSubmit = () => {
  //     alert(`Selected Year: ${selectedYear}, Month: ${selectedMonth}, Department: ${selectedDepartment}`);
  //     onClose(); // Close the popup after selection
  //   };
  
  //   return (
  //     <div 
  //     class="modal show"
  //     style={{display: 'block', position: 'fixed', top:'50'}}
  //   >
  //     <Modal.Dialog>
  //       <Modal.Header>
  //         <Modal.Title></Modal.Title>
  //       </Modal.Header>

  //       <Modal.Body>
        

  //       </Modal.Body>

  //       <Modal.Body>
        
  //         </Modal.Body>

  //       <Modal.Footer>
  //         <Button onClick={toggleUploadPopup} variant="secondary">Close</Button>
  //         <Button variant="primary">Save changes</Button>
  //       </Modal.Footer>
  //     </Modal.Dialog>
  //   </div>
  //   );
  // };


  const currentyear=new Date().getFullYear();

  const yearsArray=Array.from({length:10},(_,index)=>currentYear-index);

  console.log(edit);
  return (
  
  
     <div class="bg-white"> 
    <div>

      <div class="bg-volks h-20 pt-2 flex flex-row w-full">
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
        <div class="text-white text-sm absolute right-12 my-8">Rahul</div>
      )}
      
      </div>


      {/* <div class="w-full h-36 bg-ballon">
        <div class="ml-[850px] flex flex-row pt-8">

          <div class="text-white text-sm text-white w-20 flex flex-row  rounded hover:bg-slate-400 cursor-pointer hover:text-blue-800">
         
          </div>

          <div class="text-white text-sm w-20 flex flex-row  rounded ml-4 hover:bg-slate-400 cursor-pointer hover:text-blue-800">
          
          </div>


          <div class="text-white text-sm w-24 flex flex-row rounded ml-4 hover:bg-slate-400 cursor-pointer hover:text-blue-800">
  
          </div>


        </div>

        <div class="flex flex-row">
        <div class="ml-0 h-1/5 w-1/5">
          <img class="rounded-full w-2/5 h-2/5 ml-10" src={balnkprofile} alt=""></img>
        </div>

        <div class="mt-0 ml-0">
          <h1 class="text-lg text-white font-bold">Rahul Jharkharia</h1>
          <p class="leading-3 text-white">SFIT, VWITS India</p>
          <p class="text-blue-800 leading-3 hover:underline cursor:pointer">rahul.jharkharia@volkswagen.co.in</p>

        </div>

        </div>

      </div> */}

    {access=='manager' && (
      <div class="flex mt-2 items-right justify-end bg-red-800">
      
       
        <div class="">
          {/* <div class="dropdown cursor-pointer">
                    <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      {uploadYear}

                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadYear("2022")}>2022</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadYear("2023")}>2023</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadYear("2024")}>2024</a></li>
                    </ul>
          </div> */}
        </div>
          {/* <div class="dropdown cursor-pointer">
                    <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      {uploadMonth}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Jan")}>January</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Feb")}>February</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Mar")}>March</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Apr")}>April</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("May")}>May</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Jun")}>June</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Jul")}>July</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Aug")}>August</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Sep")}>September</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Oct")}>October</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("November")}>November</a></li>
                      <li><a class="dropdown-item text-center" onClick={()=>handleUploadMonth("Dec")}>December</a></li>
                    </ul>
          </div> */}
        


      </div>
    )}   
    {/* <div class="border-2 border-indigo-600 w-1/12 ml-12 bg-white">
          <button onClick={()=>setIsOpen(!isOpen)}><h6 class="ml-4">History
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
  </svg> 
            
            </h6></button>
          {isOpen &&(
            <div class="ml-3">
              <h6>3 Months</h6>
              <h6>6 Months</h6>
              <h6>9 Months</h6>
              <h6>12 Months</h6>

            </div> 
          )}

    </div>  */} 
    <div class="">
    {/* <div class="ml-10">
      <div class="dropdown">
                <button style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  {viewYear}
                </button>
                <ul class="dropdown-menu cursor-pointer" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2022)}>2022</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2023)}>2023</a></li>
                  <li><a class="dropdown-item text-center" onClick={()=>handleViewYear(2024)}>2024</a></li>
                </ul>
      </div>
  </div> */}

    <div class="flex">

    <div class="">
      <div class="dropdown my-4 ml-10">
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

  <div class="bg-white  max-w-3xl my-4 ml-24  rounded overflow-hidden relative flex border-solid border-2">
    <button onClick={scrollLeft} class="h-full w-18 flex items-center top-0">
        <svg class="text-gray w-6 h-6 mt-[6px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
    </button>

    


    
    <ul ref={containerRef} class="flex gap-x-4 py-3 px-4 m-0 overflow-x-scroll scrollbar-hide">
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

  <div class=" ml-28  my-4 cursor-pointer flex flex-col" >


<button onClick={toggleUploadPopup} style={{backgroundColor: '#5f1939',color:'white'}} class="btn btn-secondary dropdown-toggle relative" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Upload</button>       
<Dialog open={isUploadPopUpOpen} maxWidth="lg">
   <DialogTitle>
     Choose The File
   </DialogTitle>

   <DialogContent>
<div class="flex flex-row">
   <Form.Group class="mr-4">
         <Form.Label>Year</Form.Label>
   </Form.Group>

 <Form.Select  style={{ textAlign: 'center' ,width:'150px', marginLeft:'18px'}} size="sm" onChange={handleUploadYear}>
    
   {yearsArray.map((item,index)=>(
     <option class="justify-center items-center hover:bg-black" key={index} value={item}>{item}</option>
     
   ))}
 
 </Form.Select>
 </div>


 <div class="flex flex-row mt-2">
 <Form.Group>
         <Form.Label class="mr-4">Month</Form.Label>

         </Form.Group>

   <Form.Select style={{ textAlign: 'center' ,width:'150px'}} size="sm" onChange={handleUploadMonth}>
   <option>January</option>
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
 </div>
 {/* <Form.Group>
         <Form.Label>Department</Form.Label>
   </Form.Group> */}


   {/* <Form.Select style={{ textAlign: 'center' }} size="sm" onChange={handleUploadDepartment}>
   <option>SFIT</option>
   <option>MES</option>
   <option>KOKO</option>
 </Form.Select> */}

 <div lass="flex flex-row">
   <Form.Group class="mt-2">
           <Form.Label>Choose File</Form.Label>
   </Form.Group>
     
   <Form.Control type="file" onChange={fileSelectedHandler} style={{width:'250px'}}/>  
 </div>
     <Modal.Footer class="py-2">
       <Button variant="Secondary" onClick={handleEditCancel}>Cancel</Button>
       <Button color='primary' onClick={fileUploadHandler}>Save</Button>
     </Modal.Footer>

     {isFileSelected && (
       <div class="justify-evenly">
         {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
             {/* <button class="bg-green-300 w-1/2 rounded text-white" onClick={fileUploadHandler} disabled={uploading}>
                 
             </button> */}
             {uploading &&(<h6>'Uploading...'</h6>)}
             {/* <button class="w-1/2 bg-red-500 rounded text-white" onClick={cancelUpload}>Cancel</button> */}

       </div>
       
     )
     }
   </DialogContent>
 </Dialog>

   {/* <label class="w-44 text-center bg-volks text-white h-9 items-center rounded cursor-pointer" htmlFor='input-file'><p class="mt-1">➕Add Rota File</p></label>
 <input type="file" id='input-file' style={{display:'none'}}  onChange={fileSelectedHandler} >
 </input> */}

     {/* {isFileSelected && (
       <div class="justify-evenly">
         {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
             <button class="bg-green-300 w-1/2 rounded text-white" onClick={fileUploadHandler} disabled={uploading}>
                 {uploading ? 'Uploading...' : 'Submit'}
             </button>
             <button class="w-1/2 bg-red-500 rounded text-white" onClick={cancelUpload}>Cancel</button>

       </div>
       
     )
     } */}
 </div> 
  </div>
  
  </div>
  
  <div class="my-4 mx-12">
    <button onClick={handleDownload} type="button" class="btn btn-success float-right">Download</button> 
  </div> 

      {
        <div class="text-center mx-28 justify-center">
        <h1>{department} {viewMonth} {viewYear} Shift </h1>
        </div>
        }


    <div class="mt-4 ml-12 w-11/12 "> 
      
      <table class="table table-bordered border-gray-300" id="datatable">
  <thead class="text-center">
    <tr>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Employee Id</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Employee Name </th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">General</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Morning</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">AfterNoon</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Night</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Total</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Billable Project DLV (YES/NO)</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Allowance(INR)</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Rest Day</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Substitue Rest Day</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Rest Day Dates</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope="col">Planned Leave</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Unplanned Leave</th>
      {viewMonth==='Jan'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">National Holiday (26th Jan)</th>}
      {viewMonth==='May'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">National Holiday (1st May)</th>}
      {viewMonth==='Aug'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">National Holiday (15th Aug)</th>}
      {viewMonth==='Oct'  && <th style={{backgroundColor: '#5f1939',color:'white'}} scope="col">National Holiday (2nd Oct)</th>}
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>On Call(In Hrs)</th>
      {/* <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>On Call Dates</th> */}
      {/* <th style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Work Off Dates</th> */}
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Work Off</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white', display:'none'}} scope='col'>Work Off Dates</th>
      <th class="text-center align-middle" style={{backgroundColor: '#5f1939',color:'white'}} scope='col'>Comments(if any)</th>    
    
    </tr>
  </thead>
  <tbody class='text-center'>
   
      {users.map((user,index)=>(    
        
        <tr key={index} className={getRowClass(user.totalCount,user.workingDays)}>
        <td>{user.employee.employeeId}</td>
        <td class="cursor-pointer origin-center text-left hover:shadow-inner hover:shadow-volks" onClick={()=>handleEmployeeClick(user.employee.employeeName)}>{user.employee.employeeName}</td>
        <td>{user.general} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenEdit(user,"general")}/>} </td>
        <td>{user.morningShiftCount} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenEdit(user,"morning")}/>} </td>
        <td>{user.afternoonShiftCount}  {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenEdit(user,"afternoon")}/>}</td>
        <td>{user.nightShiftCount} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenEdit(user,"night")}/>}</td>
        <td>{user.totalCount}</td>
        <td>{user.allowanceBillable} {edit==true && <ChangeCircleIcon fontSize="extrasmall" onClick={()=>handleBillable(user)}/>}</td>
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
        {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenSunday(user)} />}
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
        {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenSubstitue(user)} />}
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
{edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenSubstitue(user)} />}
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
          {user.plannedLeaveDates.length} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handle_pl_upl_edit(user,"pl")}/>}
        {hoveredCell_pl==='cell'+user.id && (user.plannedLeaveDates.length)!=0 &&(
                <div id="movableDiv" className="text-xs rounded w-24 h-auto z-10 absolute bg-white border border-gray-300 p-2 ">  
                  

          {Object.keys(user.plannedLeaveDates).map(key=>
          <p class="text-xs">{user.plannedLeaveDates[key]}</p>)}
                  </div> 
          )}
        </td>
        <td onMouseOver={()=>handleCellHover_upl('cell'+user.id,user)} onMouseOut={(handleCellLeave_upl)}>{user.unplannedLeave} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handle_pl_upl_edit(user,"upl")}/>}

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
        <td onMouseOver={()=>handleCellHover_oncall('cell'+user.id)} onMouseOut={(handleCellLeave_oncall)}>{user.onCallCount}{edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handle_open_on_call(user,"oncall")} />}
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

        <td onMouseOver={()=>handleCellHover_workoff('cell'+user.id)} onMouseOut={(handleCellLeave_workoff)}>{user.workOffCount} {edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handleOpenEdit_Work_Oncall(user,"workOff")} />}

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
        
        <td>{user.comment}{edit==true && <EditIcon fontSize="extrasmall" onClick={()=>handle_comment(user)}/>}</td>

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
</table>

</div>    

    </div>  

    </div>
  );
}

export default App;
