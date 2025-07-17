
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import UserLogin from './pages/userPages/userLogin'
import UserRegister from './pages/userPages/userRegister'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
      <Route index element={<HomePage />} />
      </Route>

      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />

    </Routes>
  )
}

export default App
