
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profil from './components/Profil';
import CreateChatbot from './components/CreateChatbot';
import MyChatbots from './components/MyChatbots';
import CustomChat from './components/CustomChat';
import Welcome from './components/Welcome';
import AdminPage from './components/AdminPage';
import AboutPage from './components/AboutPage';



function App() {
  const token = localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Welcome />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/chat" element={token ? <Chatbot /> : <Navigate to="/login" />} />
        <Route path="/about" element={token ? <AboutPage /> : <Navigate to="/login" />} />

        <Route path="/profil" element={token ? <Profil /> : <Navigate to="/login" />} />
        <Route path="/create-chatbot" element={token ? <CreateChatbot /> : <Navigate to="/login" />} />
        <Route path="/my-chatbots" element={token ? <MyChatbots /> : <Navigate to="/login" />} />
        <Route path="/chat/:chatbotId" element={token ? <CustomChat /> : <Navigate to="/login" />} />
        <Route path="/custom-chatbot/:chatbotId" element={token ? <CustomChat /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token ? <AdminPage /> : <Navigate to="/login" />} />


        <Route path="*" element={<Navigate to="/" />} />

        {/* <Route path="/admin" element={<AdminPage />} /> */}

        
      </Routes>
    </Router>
  );
}

export default App;
