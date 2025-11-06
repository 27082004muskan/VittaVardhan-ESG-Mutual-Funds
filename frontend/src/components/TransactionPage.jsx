import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLeaf, FaCheckCircle, FaChartLine, FaInfoCircle } from 'react-icons/fa';

const TransactionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fund } = location.state || {};
  const [amount, setAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('greenCoins') || '0', 10);
    setTotalCoins(isNaN(stored) ? 0 : stored);
  }, []);

  if (!fund) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl text-gray-700 mb-4">No fund selected. Please go back and select a fund.</h2>
        <button 
          onClick={() => navigate(-1)} // ✅ FIXED: Changed from '/features' to navigate(-1)
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Funds
        </button>
      </div>
    );
  }

  const handleTransaction = (e) => {
    e.preventDefault();
    const units = (parseFloat(amount) / 10).toFixed(2);
    const newTransaction = {
      fund: fund.schemeName,
      amount: parseFloat(amount),
      units,
      date: new Date().toLocaleString(),
      schemeCode: fund.schemeCode
    };
    setTransaction(newTransaction);
    // Award coins via backend (falls back to local if no token)
    const coins = Math.floor(parseFloat(amount) / 500);
    const token = localStorage.getItem('token');
    if (coins > 0 && token) {
      fetch('http://localhost:5001/api/coins/award', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coins })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCoinsAwarded(data.coinsAwarded || coins);
          setTotalCoins(data.totalCoins ?? 0);
        } else {
          // fallback local
          const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
          const updated = current + coins;
          localStorage.setItem('greenCoins', String(updated));
          setCoinsAwarded(coins);
          setTotalCoins(updated);
        }
      })
      .catch(() => {
        const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
        const updated = current + coins;
        localStorage.setItem('greenCoins', String(updated));
        setCoinsAwarded(coins);
        setTotalCoins(updated);
      });
    } else if (coins > 0) {
      const current = parseInt(localStorage.getItem('greenCoins') || '0', 10) || 0;
      const updated = current + coins;
      localStorage.setItem('greenCoins', String(updated));
      setCoinsAwarded(coins);
      setTotalCoins(updated);
    } else {
      setCoinsAwarded(0);
    }
    setShowConfirmation(true);
  };

  const styles = {
    // ... all your existing styles remain the same
    pageWrapper: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#111827',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px 20px',
      color: '#f3f4f6'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '30px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '1.1rem',
      padding: '8px 16px',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    },
    card: {
      backgroundColor: '#111827',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      border: '1px solid #374151'
    },
    fundName: {
      fontSize: '1.8rem',
      color: '#10b981',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '2px solid #374151',
      paddingBottom: '16px'
    },
    fundInfo: {
      backgroundColor: '#1f2937',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #374151',
      color: '#f3f4f6'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '1.1rem',
      color: '#f3f4f6',
      fontWeight: '500'
    },
    input: {
      padding: '16px',
      backgroundColor: '#1f2937',
      border: '2px solid #374151',
      borderRadius: '10px',
      fontSize: '1.1rem',
      color: '#f3f4f6',
      transition: 'all 0.2s ease',
      ':focus': {
        borderColor: '#10b981',
        outline: 'none'
      }
    },
    button: {
      padding: '16px 32px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#059669',
        transform: 'scale(1.02)'
      },
      ':disabled': {
        backgroundColor: '#065f46',
        cursor: 'not-allowed'
      }
    },
    confirmation: {
      textAlign: 'center',
      padding: '40px 24px'
    },
    successIcon: {
      color: '#10b981',
      fontSize: '64px',
      marginBottom: '24px'
    },
    confirmationDetails: {
      backgroundColor: '#1f2937',
      padding: '24px',
      borderRadius: '12px',
      marginTop: '24px',
      marginBottom: '32px',
      border: '1px solid #374151'
    }
  };

  if (showConfirmation) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.confirmation}>
              <FaCheckCircle style={styles.successIcon} />
              <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '16px' }}>
                Investment Successful!
              </h2>
              <div style={styles.confirmationDetails}>
                <p style={{ fontSize: '1.2rem', color: '#f3f4f6' }}>
                  You have invested ₹{transaction.amount.toLocaleString()} in
                </p>
                <p style={{ fontSize: '1.4rem', fontWeight: '600', color: '#10b981', margin: '12px 0' }}>
                  {transaction.fund}
                </p>
                {coinsAwarded > 0 && (
                  <div style={{
                    marginTop: '12px',
                    marginBottom: '8px',
                    backgroundColor: '#052e1c',
                    border: '1px solid #065f46',
                    color: '#a7f3d0',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{fontSize: '1.4rem'}}>🪙</span>
                    <div>
                      <div style={{fontWeight: 700}}>You earned {coinsAwarded} coin{coinsAwarded>1?'s':''}!</div>
                      <div style={{opacity: 0.9}}>Total Coins: {totalCoins}</div>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '24px', color: '#d1d5db' }}>
                  <p style={{ marginBottom: '8px' }}>
                    <FaChartLine style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                    Units allocated: {transaction.units}
                  </p>
                  <p>
                    <FaInfoCircle style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                    Transaction Date: {transaction.date}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate(-1)} // ✅ This one was already correct
                style={{
                  ...styles.button,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaLeaf /> Back to Green Funds
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            onClick={() => navigate(-1)} // ✅ FIXED: Changed from navigate('/') to navigate(-1)
            style={styles.backButton}
          >
            <FaArrowLeft /> Back to Green Funds
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.fundName}>
            <FaLeaf />
            {fund.schemeName}
          </h2>

          <div style={styles.fundInfo}>
            <div style={styles.infoRow}>
              <span>Scheme Code:</span>
              <span>{fund.schemeCode}</span>
            </div>
            {fund.isinGrowth && (
              <div style={styles.infoRow}>
                <span>ISIN (Growth):</span>
                <span>{fund.isinGrowth}</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleTransaction} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Investment Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="100"
                required
                placeholder="Enter amount (minimum ₹100)"
                style={styles.input}
              />
              <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '4px' }}>
                Minimum investment: ₹100
              </p>
            </div>
            
            <button 
              type="submit"
              style={styles.button}
              disabled={!amount || amount < 100}
            >
              Invest Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
