import React from 'react';
import AdminHeader from './AdminHeader';
import Footer from './Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
