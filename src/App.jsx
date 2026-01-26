import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import OperatorDashboard from "./OperatorDashboard.jsx";
import MixtureDb from "./MixtureDb.jsx";
import MaterialEntries from "./MaterialEntries.jsx";
import AssignmentsPage from "./AssignmentsPage/AssignmentsPage.jsx";
import MixtureForm from "./MixtureForm.jsx";
import ViewTask from "./ViewTasks/ViewTask.jsx";
import TransferTask from "./TransferTasks/TransferTask.jsx";
import MixtureTaskdetails from "./MixtureTaskdetails.jsx";
import ReviewTasks from "./ReviewTasks.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Helper from "./Helper.jsx";
import QRScanner from "./QRScanner";
import InventoryScannerPage from "./InventoryScannerPage";
import DriverDashboard from "./Driver/DriverDashboard.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/mixture-db" element={<MixtureDb />} />
          <Route path="/mixture-form" element={<MixtureForm />} />
          <Route
            path="/material-entries/:mixtureId"
            element={<MaterialEntries />}
          />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/viewtask" element={<ViewTask />} />
          <Route path="/transfertask" element={<TransferTask />} />
          <Route
            path="/mixture-task-details"
            element={<MixtureTaskdetails />}
          />
          <Route path="/helper" element={<Helper />} />
          <Route path="/review-tasks" element={<ReviewTasks />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/qr-scanner" element={<QRScanner />} />
          <Route
            path="/admin/inventory-scanner"
            element={<InventoryScannerPage />}
          />
          {/* Auth */}
          <Route path="/driver-dashboard" element={<DriverDashboard />} />

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
