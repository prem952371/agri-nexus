import React from 'react';
import { Outlet } from 'react-router-dom';
import GovernmentTopbar from '../components/GovernmentTopbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer from '../components/ToastContainer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-agri-light">
      <GovernmentTopbar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
