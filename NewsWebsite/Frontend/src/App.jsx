import React from 'react'
import UserRegister from './pages/UserRegister'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserHome from './pages/UserHome'
import SpecificNewsPage from './pages/SpecificNewsPAge'


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/news/:id" element={<SpecificNewsPage />} />

    </Routes>
  )
}

export default App
