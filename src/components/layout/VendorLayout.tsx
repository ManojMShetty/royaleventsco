import React from 'react';
import VendorHeader from './VendorHeader';
import Footer from './Footer';

interface VendorLayoutProps {
  children: React.ReactNode;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <VendorHeader />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default VendorLayout;
