import React, { useState, useEffect } from 'react';

const GreenNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async () => {
    try {
      console.log('Attempting to fetch news...'); // Debug log
      const response = await fetch(`http://localhost:5000/api/news${searchTerm ? `?topic=${searchTerm}` : ''}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received news data:', data); // Debug log
      setNews(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err); // Debug log
      setError(`Failed to fetch news: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [searchTerm]); // Added searchTerm dependency

  // Add search input section
  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews();
  };

  if (loading) return <div className="text-center">Loading news...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🌍 Live Green Investment News</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news topics..."
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {news.map((article, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
          <p className="text-gray-300 mb-3">{article.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400"
            >
              Read More →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GreenNews; 