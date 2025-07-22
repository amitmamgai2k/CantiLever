import {  Share2,  } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentLocation } from '../../redux/slices/userAuthSlice';



function CurrentLocation() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
 const [loading, setLoading] = useState(false);

const getLocation = () => {
  setLoading(true);
  navigator.geolocation.getCurrentPosition((position) => {
    dispatch(currentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }));


    navigate('/');
  },
  (error) => {
    console.error("Error getting location:", error);

  },
  () => setLoading(false));
};


  return (
    <div className='flex items-center justify-center min-h-screen'>
        <Share2 className='h-6 w-6 mr-2'/>


         <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"   onClick={getLocation}>Share Current Location</button>


    </div>
  )
}

export default CurrentLocation
