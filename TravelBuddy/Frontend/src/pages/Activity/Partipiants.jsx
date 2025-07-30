import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageCircle,
  User
} from 'lucide-react';

function ParticipantsTable({ participants = [], activityLimit = 10 }) {
  const [searchQuery, setSearchQuery] = useState('');


  const filteredParticipants = participants.filter(participant =>
    participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.mobile.includes(searchQuery)
  );



  const handleSendMessage = (participant) => {
    // Implement message functionality
    console.log('Send message to:', participant.fullName);
  };

  const handleCall = (participant) => {
    // Implement call functionality
    window.open(`tel:${participant.phoneNumber}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-amber-600" size={28} />
              Participants ({filteredParticipants.length})
            </h2>
            <p className="text-gray-600 mt-1">Manage and view all activity participants</p>
          </div>

        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search participants by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Participant</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <tr key={participant._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {participant.profilePicture ? (
                        <img
                          src={participant.profilePicture}
                          alt={participant.fullName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {participant.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{participant.fullName}</p>

                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{participant.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{participant.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(participant.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendMessage(participant)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleCall(participant)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery ? 'No matching participants' : 'No participants yet'}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery
                          ? 'Try adjusting your search terms to find participants.'
                          : 'Participants will appear here once they join your activity.'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {filteredParticipants.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredParticipants.length} of {participants.length} participants
            </span>
            <div className="flex items-center gap-2">
              <span>Activity capacity:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${(participants.length / activityLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium">
                  {participants.length}/{activityLimit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantsTable;