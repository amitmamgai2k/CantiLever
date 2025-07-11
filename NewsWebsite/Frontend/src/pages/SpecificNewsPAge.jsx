import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NavBar from '../Components/NavBar';
import { AlertCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../helper/firebase';
import axios from 'axios';

function SpecificNewsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);



  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${NEWS_API_BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${id}&sortBy=publishedAt&pageSize=20&language=en`
        );

        if (response.data.status === 'error') throw new Error(response.data.message);

        const validArticles = response.data.articles.filter(article =>
          article.title && article.title !== '[Removed]' && article.urlToImage
        );

        setArticles(validArticles);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
      }
      setLoading(false);
    };

    fetchNews();
  }, [id]);
  const checkLoginStatus = (articleUrl) => {
      if (!currentUser) {
        toast.error('Please log in to read full articles');
        navigate('/user/login');
      } else {
        window.open(articleUrl, '_blank');
      }
    };


  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading {id} news...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load News</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center capitalize">
          {id} News
        </h1>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found for "{id}"</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                onClick={() => checkLoginStatus(article.url)}
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex  gap-2 ">
                     <Clock className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                <span className="text-xs text-gray-500 mb-2">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-600 font-medium">
                      {article.source.name}
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpecificNewsPage;