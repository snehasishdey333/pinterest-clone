import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import CreatePinPage from './pages/CreatePinPage.tsx'
import PinPage from './pages/PinPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import HomePage from './pages/HomePage.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import AuthPage from './pages/AuthPage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserDetailsPage from './pages/UserDetails.tsx'
import AuthenticatedRoute from './layouts/AuthenticatedRoute.tsx'


const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
      {/* <Route element={<MainLayout/>}>
      <Route path="/" element={<HomePage />} /> */}
      {/* <Route path="/create" element={<CreatePinPage/>} />
      <Route path="/pin/:id" element={<PinPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/search" element={<SearchPage/>} />
      <Route path="/user/:id" element={<UserDetailsPage/>} /> */}
      
      <Route element={<AuthenticatedRoute />}>
            
      <Route element={<MainLayout />}>
              <Route path="/create" element={<CreatePinPage />} />
              <Route path="/pin/:id" element={<PinPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/user/:id" element={<UserDetailsPage />} />
              </Route>
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
          </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
