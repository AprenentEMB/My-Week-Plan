import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './i18n';
import { SidebarProvider } from './components/ui/sidebar';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react'; // ✅ import Analytics

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
      <HelmetProvider>
        <App />
        <Analytics /> 
      </HelmetProvider>
    </SidebarProvider>
  </StrictMode>
);



//Afegir selector de setmana i que també s'inclogui al export del pdf
