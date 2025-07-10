import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import NavBar from '../Components/NavBar';

function Contact() {
  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Mail className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-lg">amitmamgai2k@gmail.com</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Phone className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 text-lg">7011343807</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <MapPin className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Address</h3>
            <p className="text-gray-600 text-lg">
              Bijwasan<br />
              New Delhi<br />
              110061
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;