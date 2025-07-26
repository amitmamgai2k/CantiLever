
import PrivateRoute from './components/PrivateRoute';
import UserLogin from './pages/userPages/userLogin';
import UserRegister from './pages/userPages/userRegister';
import Layout from './Components/Layout';
import { Routes, Route } from 'react-router-dom';
import CurrentLocation from './pages/userPages/CurrentLocation';
import HomePage from './pages/HomePage';
import { loadUser } from './redux/slices/userAuthSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AllTravelersOnMap from './components/AllTravelersOnMap';
import CreateActivity from './pages/Activity/CreateActivity';
import ActivityNearMe from './pages/Activity/ActivityNearMe';
import InvididualActivity from './pages/Activity/InvididualActivity';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
   dispatch(loadUser());
}, [dispatch]);



  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<HomePage />} />
          <Route path="/map" element={<AllTravelersOnMap />} />
          <Route path = "/create-activity" element={<CreateActivity />} />
          <Route path = "/activity-near-me" element={<ActivityNearMe />} />
          <Route path = "/activity/:id" element={<InvididualActivity />} />

        <Route index element={
          <PrivateRoute>
            <HomePage/>
              <CurrentLocation/>

          </PrivateRoute>

        }

        />
      </Route>
        <Route path="/current-location" element={<CurrentLocation />} />

      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />


    </Routes>
  );
}
