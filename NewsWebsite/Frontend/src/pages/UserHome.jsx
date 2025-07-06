import React from 'react'
import NavBar from '../Components/NavBar'

function UserHome() {
  return (
    <div>
      <NavBar />
      <h1 className="text-3xl font-bold text-gray-700">Welcome to Your Dashboard</h1>
      <p className="mt-2 text-gray-600">Here you can manage your account settings and preferences.</p>
    </div>
  )
}

export default UserHome
