import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getNearbyActivities } from "../../redux/slices/userActivitySlice";
import { Loader2, MapPin, Users, Calendar, Search, Filter, Star, Clock, Zap } from "lucide-react";


function ActivityNearMe() {
  const currentUser = useSelector((state) => state.userAuth.user);
  const { activities } = useSelector((state) => state.userActivity);

  const dispatch = useDispatch();


  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser?.currentLocation) return;

    setLoading(true);
    dispatch(
      getNearbyActivities({
        lat: currentUser.currentLocation.lat,
        lng: currentUser.currentLocation.lng
      })

    )
    setLoading(false);
}, [dispatch, currentUser]);


  // Filter activities by search query
  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.location.formattedAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const getActivityStatus = (activity) => {
    const currentParticipants = activity.participants.length ;
    const limit = activity.participantLimit;
    const spotsLeft = limit - currentParticipants;

    if (spotsLeft <= 0) {
      return { type: 'full', text: 'Activity Full', spotsLeft: 0 };
    } else if (spotsLeft <= 3) {
      return { type: 'limited', text: `${spotsLeft} spots left`, spotsLeft };
    } else {
      return { type: 'available', text: `${spotsLeft} spots available`, spotsLeft };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Discover Amazing Activities
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Connect with your community and find exciting activities happening near you
            </p>
          </div>
        </div>


        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities by title, description, or location..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Near your location
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Updated recently
              </span>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <Loader2 className="animate-spin w-12 h-12 text-amber-600" />
              <div className="absolute inset-0 animate-ping w-12 h-12 rounded-full bg-amber-200 opacity-75"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Discovering activities near you...</p>
          </div>
        )}

        {!loading && filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We couldn't find any activities matching your search. Try adjusting your search terms or check back later.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Activities Grid */}
        {!loading && filteredActivities.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'} Found
                </h2>

              </div>
              <div className="text-sm text-gray-600">
                Showing results within 20 Km
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredActivities.map((activity, index) => {
                const status = getActivityStatus(activity);

                return (
                  <div
                    key={activity._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold line-clamp-2 flex-1 mr-3">{activity.title}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            status.type === 'full'
                              ? 'bg-red-500 text-white'
                              : status.type === 'limited'
                                ? 'bg-yellow-400 text-yellow-900'
                                : 'bg-green-400 text-green-900'
                          }`}>
                            {status.text}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-amber-100">
                          <span className="flex items-center text-sm">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            New
                          </span>
                          <span className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-1" />
                            {activity.currentParticipants || 0}/{activity.participantLimit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {activity.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.date}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start text-gray-700">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <MapPin className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-relaxed">
                              {activity.location.formattedAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Creator Info */}
                      {activity.creator && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            {activity.creator.profilePicture ? (
                              <img
                                src={activity.creator.profilePicture}
                                alt={activity.creator.fullName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {activity.creator.fullName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {activity.creator.fullName}
                              </p>
                              <p className="text-xs text-gray-500">Organizer</p>
                            </div>
                          </div>

                          {status.type === 'full' ? (
                            <button
                              disabled
                              className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed"
                            >
                              Activity Full
                            </button>
                          ) : (
                            <button className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 group-hover:shadow-lg ${
                              status.type === 'limited'
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-amber-600 hover:bg-amber-700'
                            }`}>
                              {status.type === 'limited' ? 'Join Quick!' : 'Join Activity'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ActivityNearMe;