import React from 'react'
import UserRegister from './pages/UserRegister'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserHome from './pages/UserHome'


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />

    </Routes>
  )
}

export default App
