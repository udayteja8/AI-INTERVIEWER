import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";  // Your actual login page
import Signup from "./pages/Signup";
import Post from "./pages/post";  // This is where users choose upload or topic
import UploadResume from "./pages/UploadResume";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Topic from "./pages/topic";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post" element={<Post />} />  {/* After login, goes here */}
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/choose-topic" element={<Topic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;