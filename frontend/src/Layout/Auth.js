// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      
      <main>
        {/* Main content */}
        <Outlet />
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;
