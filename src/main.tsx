import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app/App.tsx'
import Chatbot from './components/Chatbot/Chatbot'
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './utils/auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <Chatbot />
  </StrictMode>,
)
