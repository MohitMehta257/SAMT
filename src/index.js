import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Employee from './components/Employee';
import { BrowserRouter, Route, Routes, Redirect } from 'react-router-dom';
import Login from './components/Login';
import PDDashboard from './components/PDDashboard';
import { GlobalProvider } from './components/GlobalContext';
import ComponentB from './components/ComponentB';
import Component from './components/Component';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
<GlobalProvider>
  <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Login}></Route>
        <Route path="/employee/:name/:current_month/:current_year/:access/:department" Component={Employee}></Route>
        <Route path="/home/:access" Component={App}></Route>
        <Route path="/pddashboard" Component={PDDashboard}> </Route>
        <Route path="/Component" Component={ComponentB}> </Route>
      </Routes>
  </BrowserRouter>
</GlobalProvider>
  

,document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
