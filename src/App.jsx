import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TaskManagerPage from "@/components/pages/TaskManagerPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<TaskManagerPage />} />
        </Routes>
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
          className="mt-16"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;