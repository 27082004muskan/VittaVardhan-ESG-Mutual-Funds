import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaLeaf, FaChartLine, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import '../styles/GreenFundSearch.css';
import { useNavigate } from 'react-router-dom';

const GreenFundSearch = () => {
  const [mutualFunds, setMutualFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    // Fund Categories
    environmental: true,
    social: true,
    governance: true,
    
    // Fund Types (based on name analysis)
    equity: true,
    debt: true,
    hybrid: true,
    index: true,
    
    // Specific Categories
    infrastructure: true,
    technology: true,
    ethical: true,
    
    // Distribution Type
    growth: true,
    dividend: true
  });

  // New states to improve interactivity
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMutualFunds = async () => {
      try {
        const response = await axios.get('https://api.mfapi.in/mf');
        const fundsArray = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data.data) ? response.data.data : [];
        
        // Let's log a sample fund to see available fields
        console.log("Sample Fund Data:", fundsArray[0]);
        
        const greenFunds = fundsArray.filter(fund => {
          const name = fund.schemeName?.toLowerCase() || '';
          return (
            // Environmental funds
            name.includes('environmental') ||
            name.includes('green energy') || 
            name.includes('clean energy') ||
            name.includes('eco') ||
            
            // Social funds
            name.includes('social') || 
            name.includes('community') ||
            name.includes('diversity') ||
            name.includes('inclusion') ||
            
            // Governance funds
            name.includes('governance') ||
            name.includes('ethical') ||
            name.includes('responsible investing') ||
            
            // Combined ESG
            name.includes('esg')
          );
        });

        // Log filtered funds to see what we're working with
        console.log("Filtered Funds:", greenFunds.length);
        if (greenFunds.length > 0) {
          console.log("Sample Green Fund:", greenFunds[0]);
        }
        
        setMutualFunds(greenFunds);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError('Failed to fetch mutual funds data');
        setLoading(false);
      }
    };

    fetchMutualFunds();
  }, []);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleFundClick = (fund) => {
    navigate('/transaction', { state: { fund } });
  };

  const filteredFunds = mutualFunds.filter(fund => {
    const name = fund.schemeName.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    
    // Category matching
    const isESG = name.includes('esg');
    const isEnvironmental = filters.environmental && (name.includes('environmental') || name.includes('green') || isESG);
    const isSocial = filters.social && (name.includes('social') || name.includes('community') || isESG);
    const isGovernance = filters.governance && (name.includes('governance') || name.includes('ethical') || isESG);
    
    // Fund type matching
    const isEquity = filters.equity && (name.includes('equity') || name.includes('stock'));
    const isDebt = filters.debt && (name.includes('debt') || name.includes('bond') || name.includes('gilt'));
    const isHybrid = filters.hybrid && name.includes('hybrid');
    const isIndex = filters.index && name.includes('index');
    
    // Specific category matching
    const isInfrastructure = filters.infrastructure && name.includes('infrastructure');
    const isTechnology = filters.technology && (name.includes('tech') || name.includes('digital'));
    const isEthical = filters.ethical && name.includes('ethical');
    
    // Distribution type matching
    const isGrowth = filters.growth && name.includes('growth');
    const isDividend = filters.dividend && (name.includes('dividend') || name.includes('idcw'));

    return matchesSearch && (
      isEnvironmental || isSocial || isGovernance ||
      isEquity || isDebt || isHybrid || isIndex ||
      isInfrastructure || isTechnology || isEthical ||
      isGrowth || isDividend
    );
  });

  const styles = {
    mainContent: {
      margin: '20px auto',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '1400px',
      backgroundColor: '#111827',
      color: '#f3f4f6',
      overflowY: 'auto',
      position: 'relative',
      padding: '40px 20px'
    },
    container: {
      width: '100%',
      margin: '0 auto'
    },
    header: {
      marginBottom: '20px'
    },
    title: {
      fontSize: '2.5rem',
      color: '#10b981',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      color: '#d1d5db',
      fontSize: '1.1rem'
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '20px'
    },
    searchInput: {
      width: '100%',
      padding: '16px 48px',
      fontSize: '1.1rem',
      backgroundColor: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '10px',
      color: '#f3f4f6',
      transition: 'all 0.2s ease'
    },
    searchInputFocus: {
      borderColor: '#10b981',
      boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
    },
    filterContainer: {
      backgroundColor: '#1f2937',
      padding: '24px',
      borderRadius: '16px',
      marginBottom: '32px'
    },
    filterSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#10b981',
      marginBottom: '16px'
    },
    filterGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px'
    },
    filterItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#111827',
      border: '1px solid #374151',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#f3f4f6',
      transition: 'background-color 0.2s ease'
    },
    checkbox: {
      accentColor: '#10b981',
      cursor: 'pointer'
    },
    fundsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    fundCard: {
      backgroundColor: '#1e293b',
      padding: '28px',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
      border: '2px solid #374151',
      borderRadius: '12px'
    },
    fundCardHover: {
      backgroundColor: '#1f2937',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      border: '2px solid #374151',
      borderRadius: '12px'
    },
    fundTitle: {
      fontSize: '1rem',
      color: '#10b981',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      lineHeight: '1.5'
    },
    fundIcon: {
      marginTop: '4px',
      flexShrink: 0
    },
    fundInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      color: '#94a3b8'
    },
    infoLabel: {
      color: '#94a3b8'
    },
    infoValue: {
      color: '#e2e8f0',
      fontFamily: 'monospace'
    },
    loadingMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '40px',
      fontSize: '1.2rem',
      color: '#10b981'
    },
    errorMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '24px',
      color: '#ef4444',
      backgroundColor: '#1f2937',
      borderRadius: '10px',
      border: '1px solid #374151'
    }
  };

  return (
    <div style={styles.mainContent}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FaLeaf style={{ color: '#10b981' }} />
            Green Investment Funds
          </h1>
          <p style={styles.subtitle}>
            Discover sustainable and environmentally conscious mutual funds
          </p>
        </div>

        <div style={styles.searchContainer}>
          <FaSearch style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#10b981'
          }} />
          <input
            type="text"
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              ...styles.searchInput,
              ...(isSearchFocused ? styles.searchInputFocus : {})
            }}
          />
        </div>

        <div style={styles.filterContainer}>
          <div style={styles.filterSection}>
            <h2 style={styles.sectionTitle}>Fund Categories</h2>
            <div style={styles.filterGroup}>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.environmental}
                  onChange={() => handleCategoryChange('environmental')}
                  style={styles.checkbox}
                />
                Environmental
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.social}
                  onChange={() => handleCategoryChange('social')}
                  style={styles.checkbox}
                />
                Social
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.governance}
                  onChange={() => handleCategoryChange('governance')}
                  style={styles.checkbox}
                />
                Governance
              </label>
            </div>
          </div>

          <div style={styles.filterSection}>
            <h2 style={styles.sectionTitle}>Fund Type</h2>
            <div style={styles.filterGroup}>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.equity}
                  onChange={() => handleCategoryChange('equity')}
                  style={styles.checkbox}
                />
                Equity
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.debt}
                  onChange={() => handleCategoryChange('debt')}
                  style={styles.checkbox}
                />
                Debt
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.hybrid}
                  onChange={() => handleCategoryChange('hybrid')}
                  style={styles.checkbox}
                />
                Hybrid
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.index}
                  onChange={() => handleCategoryChange('index')}
                  style={styles.checkbox}
                />
                Index
              </label>
            </div>
          </div>

          <div style={styles.filterSection}>
            <h2 style={styles.sectionTitle}>Distribution Type</h2>
            <div style={styles.filterGroup}>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.growth}
                  onChange={() => handleCategoryChange('growth')}
                  style={styles.checkbox}
                />
                Growth
              </label>
              <label style={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={filters.dividend}
                  onChange={() => handleCategoryChange('dividend')}
                  style={styles.checkbox}
                />
                Dividend
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingMessage}>
            <FaChartLine style={{ animation: 'spin 1s linear infinite' }} />
            Loading funds...
          </div>
        ) : error ? (
          <div style={styles.errorMessage}>
            <FaExclamationCircle />
            {error}
          </div>
        ) : (
          <div style={styles.fundsContainer}>
            {filteredFunds.length > 0 ? (
              filteredFunds.map((fund) => (
                <div 
                  key={fund.schemeCode} 
                  style={{
                    ...styles.fundCard,
                    ...(hoveredCard === fund.schemeCode ? styles.fundCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(fund.schemeCode)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleFundClick(fund)}
                >
                  <h3 style={styles.fundTitle}>
                    <FaLeaf style={styles.fundIcon} />
                    <span>{fund.schemeName}</span>
                  </h3>
                  <div style={styles.fundInfo}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Scheme Code:</span>
                      <span style={styles.infoValue}>{fund.schemeCode}</span>
                    </div>
                    {fund.isinGrowth && (
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>ISIN:</span>
                        <span style={styles.infoValue}>{fund.isinGrowth}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.errorMessage}>No green mutual funds found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenFundSearch;




