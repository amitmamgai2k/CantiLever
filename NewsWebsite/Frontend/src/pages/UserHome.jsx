import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { Clock, Eye, ArrowRight, TrendingUp, Zap, Calendar, User, ExternalLink, RefreshCw, AlertCircle, Newspaper, NewspaperIcon } from 'lucide-react';
import axios from 'axios';

// NewsAPI configuration
const NEWS_API_KEY =import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2';

function UserHome() {
  const [breakingNews, setBreakingNews] = useState([]);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [scienceNews, setScienceNews] = useState([]);
  const [politicsNews, setPoliticsNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [category, setCategory] = useState('techNews');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const newsMap = {
  breakingNews,
  topHeadlines,
  trendingNews,
  techNews,
  sportsNews,
  businessNews,
  entertainmentNews,
  healthNews,
  scienceNews,
  politicsNews,
  worldNews,
};

const selectedNews = newsMap[category] || [];

  // Fetch news from NewsAPI
  const fetchNews = async (endpoint, params = '') => {
    try {
      const response = await axios.get(
        `${NEWS_API_BASE_URL}/${endpoint}?apiKey=${NEWS_API_KEY}${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return data.articles || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch different types of news
        const [headlines, tech, sports, business,entertainment,health,science,politics,world] = await Promise.all([
          fetchNews('top-headlines', '&country=us&pageSize=20'),
          fetchNews('everything', '&q=technology&sortBy=publishedAt&pageSize=10&language=en'),
          fetchNews('everything', '&q=sports&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=business&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=entertainment&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=health&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=science&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=politics&sortBy=publishedAt&pageSize=5&language=en'),
          fetchNews('everything', '&q=world&sortBy=publishedAt&pageSize=5&language=en')



        ]);

        // Filter out articles with missing images or invalid content
        const filterValidArticles = (articles) => {
          return articles.filter(article =>
            article &&
            article.title &&
            article.title !== '[Removed]' &&
            article.description &&
            article.urlToImage &&
            article.urlToImage !== null &&
            !article.title.includes('removed') &&
            article.source.name
          );
        };



        const validHeadlines = filterValidArticles(headlines);
        const validTech = filterValidArticles(tech);
        const validSports = filterValidArticles(sports);
        const validBusiness = filterValidArticles(business);
        const validEntertainment = filterValidArticles(entertainment);
        const validHealth = filterValidArticles(health);
        const validScience = filterValidArticles(science);
        const validPolitics = filterValidArticles(politics);
        const validWorld = filterValidArticles(world);

        setTopHeadlines(validHeadlines.slice(0, 10));
        setTechNews(validTech.slice(0, 5));
        setSportsNews(validSports.slice(0, 5));
        setBreakingNews(validHeadlines.slice(0, 1));
        setTrendingNews(validHeadlines.slice(1, 7));
        setBusinessNews(validBusiness.slice(0, 5));
        setEntertainmentNews(validEntertainment.slice(0, 5));
        setHealthNews(validHealth.slice(0, 5));
        setScienceNews(validScience.slice(0, 5));
        setPoliticsNews(validPolitics.slice(0, 5));
        setWorldNews(validWorld.slice(0, 5));


      } catch (error) {
        setError('Failed to load news. Please try again later.');
        console.error('News loading error:', error);
      }

      setLoading(false);
    };

    loadNews();
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };


  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getImageUrl = (article) => {
    if (article.urlToImage && article.urlToImage !== null) {
      return article.urlToImage;
    }
    return `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80`;
  };


  if (loading) {
    return (
      <div>
        <NavBar  />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading latest news...</p>
            <p className="text-gray-500 text-sm mt-2">Fetching real-time updates from NewsAPI</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar  />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load News</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />


      {breakingNews.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold  py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 animate-pulse" />
                <span className="font-bold text-xl underline">BREAKING NEWS</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-l truncate">
                  {breakingNews[0].title}
                </p>
              </div>
              <span className="text-xs opacity-75">{formatDate(breakingNews[0].publishedAt)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* Featured Article */}
            {topHeadlines.length > 0 && (
              <section>
                <div className="relative group cursor-pointer border-b-4 border-amber-600" onClick={() => window.open(topHeadlines[0].url, '_blank')}>
                  <div className=" rounded-xl overflow-hidden bg-gray-200 ">
                    <img
                      src={getImageUrl(topHeadlines[0])}
                      alt={topHeadlines[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 "
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="bg-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                        FEATURED
                      </span>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(topHeadlines[0].publishedAt)}</span>
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                      {topHeadlines[0].title}
                    </h1>
                    <p className="text-gray-200 text-lg mb-4 line-clamp-2">
                      {topHeadlines[0].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{topHeadlines[0].source.name}</span>
                      </div>
                      <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
                      onClick={checkLoginStatus}
                      >
                        <span className="text-sm font-medium">Read More</span>
                        <ArrowRight className="h-4 w-4" />

                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Latest Headlines */}
            <section>
              <div className="flex items-center justify-between mb-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900">Latest Headlines</h2>
                <button className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium" >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {topHeadlines.slice(1, 7).map((article, index) => (
                  <article
                    key={index}
                    className="group cursor-pointer"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={getImageUrl(article)}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-amber-600 text-xs font-medium uppercase tracking-wide">
                            {article.source.name}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
                          {truncateText(article.title, 80)}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {truncateText(article.description, 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-500 text-sm">
                            <Eye className="h-4 w-4" />
                            <span>Read full article</span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors duration-200" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Trending News */}
            <section>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
                </div>

                <div className="space-y-4">
                  {trendingNews.map((article, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <div className="flex space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
                            {truncateText(article.title, 80)}
                          </h4>
                          <div className="flex items-center space-x-2 text-gray-500 text-xs">
                            <span>{article.source.name}</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Category News */}

{selectedNews.length > 0 && (
  <section>
    <div className="bg-white rounded-xl shadow-xl p-6">
    <div className="flex gap-2 ">
       <Newspaper className="h-6 w-6 text-amber-600 mb-2" />
        <h3 className="text-xl font-bold mb-4 capitalize  text-gray-900 ">{category.split('News')[0]} News</h3>
    </div>
      <div className="space-y-4">
        {selectedNews.slice(0, 5).map((article, index) => (
          <div
            key={index}
            className="group cursor-pointer border-b border-gray-300 last:border-b-0 pb-4 last:pb-0 hover:bg-gray-50 transition-colors duration-200 hover:scale-105  "
            onClick={() => window.open(article.url, '_blank')}
          >
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
              {truncateText(article.title, 70)}
            </h4>
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <span>{article.source.name}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}


            {/* Popular Categories */}
            <section>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Categories</h3>
                <div className="space-y-2">
                  {['Technology', 'Sports', 'Health', 'Business', 'Entertainment', 'Science', 'Politics', 'World'].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setCategory(category.toLowerCase() + 'News');
                        console.log(category.toLowerCase() + 'News');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
