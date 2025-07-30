
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
import JoinedActivites from './pages/Activity/JoinedActivites';
import CreatedActivites from './pages/Activity/MyCreatedActivites';
import UserProfile from './pages/userPages/UserProfile';
import MyConnections from './pages/userPages/MyConnections';
import UpdateProfile from './pages/userPages/UpdateProfile';
import ChatPage from './pages/Activity/ChatPageofActivity';
import ChatGroup from './pages/Chat/ChatGroup';
import ManageActivity from './pages/Activity/ManageActivity';

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
          <Route path = "/joined-activities" element={<JoinedActivites />} />
          <Route path = "/created-activities" element={<CreatedActivites />} />
          <Route path = "/profile" element={<UserProfile />} />
          <Route path = "/connections" element={<MyConnections />} />
          <Route path = "/update-profile" element={<UpdateProfile />} />
          <Route path = "/activity-info/:id" element={<ChatPage />} />
          <Route path = "/chat/:id" element={<ChatGroup />} />
          <Route path = "/manage-activity/:id" element={<ManageActivity />} />


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
