

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx'; 
import OperatorDashboard from './OperatorDashboard.jsx';
import AssignmentsPage from './AssignmentsPage/AssignmentsPage.jsx';


function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/operator-dashboard" element={<OperatorDashboard />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        
   
   
        
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
     <div>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
    </>
  );
  
}

export default App;