import React from 'react'
import UserRegister from './pages/UserRegister'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserHome from './pages/UserHome'
import SpecificNewsPage from './pages/SpecificNewsPAge'
import About from './pages/About'
import Contact from './pages/Contact'


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/news/:id" element={<SpecificNewsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

    </Routes>
  )
}

export default App
