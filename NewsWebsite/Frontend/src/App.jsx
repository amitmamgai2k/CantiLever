import React from 'react'
import UserRegister from './pages/UserRegister'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<h1>Login Page</h1>} />
      <Route path="/register" element={<UserRegister />} />

    </Routes>
  )
}

export default App
