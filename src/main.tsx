import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Search from './pages/Search.tsx'
import ObjectPage from './pages/ObjectPage.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {themeOptions} from "./constants/theme.ts";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme(themeOptions)}>
      <QueryClientProvider client= {queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index element={<App />}></Route>
            <Route path='search' element={<Search/>}></Route>
            <Route path="object/:id" element={<ObjectPage/>}></Route> 
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
