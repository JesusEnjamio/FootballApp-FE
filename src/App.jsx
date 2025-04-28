import React from 'react';
import { Outlet } from 'react-router-dom'; 
import "./styles/styles.css"; 
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container mx-auto p-4">
        <Outlet />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
