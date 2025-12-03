import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Inscription from './pages/Register.tsx';
import { theme } from './theme.ts';
import Dashboard from './pages/admin/Dashboard.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} >
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
            <Route path="/register" element={<Inscription/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </MantineProvider>
  </StrictMode>
);
