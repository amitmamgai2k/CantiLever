
import PrivateRoute from './components/PrivateRoute';
import UserLogin from './pages/userPages/userLogin';
import UserRegister from './pages/userPages/userRegister';
import Layout from './Components/Layout';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';

export default function App() {


  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<HomePage />} />
        <Route index element={
          <PrivateRoute>
            <HomePage/>
          </PrivateRoute>
        } />
      </Route>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
    </Routes>
  );
}
