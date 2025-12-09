import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 
import { HashRouter, Routes, Route } from 'react-router-dom';
import Contact from './pages/Contact.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Inscription from './pages/Register.tsx';
import { theme } from './theme.ts';
import Product from './pages/ProductPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import ProtectedAdminRoute from './components/admin/PrivateRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/product" element={<Product />} />
<Route path="/user/login" element={<Login />} />
<Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </HashRouter>
    </MantineProvider>
  </StrictMode>
);
