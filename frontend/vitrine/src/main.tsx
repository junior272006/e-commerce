import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import { theme } from './theme.ts';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} >
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>
    </MantineProvider>
  </StrictMode>
);
