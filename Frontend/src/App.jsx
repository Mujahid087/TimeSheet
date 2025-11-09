import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from './common/RequireAuth';
import Home from './screens/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './screens/Login';
import Logout from './common/Logout';
import CreateUser from './screens/CreateUser';
import CreateTimesheet from './screens/CreateTimeSheet';
import MyTimesheets from './screens/MyTimeSheets';
import EmployeesTimesheets from './screens/EmployeesTimesheet';
import TimesheetDetails from './screens/TimesheetDetails';
import AddToTimesheet from './screens/AddToTimesheet';
import AddTaskToTimesheet from './screens/AddTaskToTimesheet';

const App = () => {
  const theme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <div className='app'>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route
              path='/add-to-timesheet/:id'
              element={
                <RequireAuth>
                  <AddTaskToTimesheet />
                </RequireAuth>
              }
            />
            <Route
              path='/add-to-timesheet'
              element={
                <RequireAuth>
                  <AddToTimesheet />
                </RequireAuth>
              }
            />
            <Route
              path='/timesheet/:id'
              element={
                <RequireAuth>
                  <TimesheetDetails />
                </RequireAuth>
              }
            />
            <Route
              path='/employees-timesheets'
              element={
                <RequireAuth>
                  <EmployeesTimesheets />
                </RequireAuth>
              }
            />
            <Route
              path='/my-timesheets'
              element={
                <RequireAuth>
                  <MyTimesheets />
                </RequireAuth>
              }
            />
            <Route
              path='/create-timesheet'
              element={
                <RequireAuth>
                  <CreateTimesheet />
                </RequireAuth>
              }
            />
            <Route
              path='/create-user'
              element={
                <RequireAuth>
                  <CreateUser />
                </RequireAuth>
              }
            />
            <Route path='/logout' element={<Logout />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
          </Routes>
        <Footer />
        </ThemeProvider>
    </div>
  );
};

export default App;