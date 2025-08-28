import { useState } from 'react';
// import { FaLeaf, FaWater, FaSeedling, FaUsers, FaSolarPanel, FaChartLine } from 'react-icons/fa';

const ImpactCalculator = () => {
  const [investment, setInvestment] = useState('');
  const [fundType, setFundType] = useState('environmental');
  const [duration, setDuration] = useState('1');

  // Enhanced impact factors for different fund types
  const impactFactors = {
    environmental: {
      co2: 0.5,      // tons per $1000 annually
      water: 1000,    // liters per $1000 annually
      energy: 500,    // kWh per $1000 annually
      social: 2       // people impacted per $1000 annually
    },
    social: {
      co2: 0.3,
      water: 800,
      energy: 300,
      social: 5
    },
    governance: {
      co2: 0.4,
      water: 900,
      energy: 400,
      social: 3
    }
  };

  const calculateImpact = () => {
    const investmentAmount = parseFloat(investment) || 0;
    const years = parseInt(duration) || 1;
    const factor = impactFactors[fundType];
    
    return {
      co2: ((investmentAmount / 1000) * factor.co2 * years).toFixed(2),
      water: Math.round((investmentAmount / 1000) * factor.water * years),
      energy: Math.round((investmentAmount / 1000) * factor.energy * years),
      social: Math.round((investmentAmount / 1000) * factor.social * years)
    };
  };

  const impact = calculateImpact();

  const styles = {
    mainContent: {
      margin: '10px auto',
      width: '95%',
      maxWidth: '900px',
      minHeight: '90vh',
      padding: '20px 16px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      borderRadius: '12px'
    },
    title: {
      fontSize: '1.8rem',
      color: '#22c55e',
      marginBottom: '24px',
      textAlign: 'left',
      fontWeight: '600'
    },
    calculatorContainer: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    inputSection: {
      marginBottom: '24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    inputLabel: {
      display: 'block',
      color: '#94a3b8',
      marginBottom: '6px',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '6px',
      color: '#f8fafc',
      fontSize: '0.9rem',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '6px',
      color: '#f8fafc',
      fontSize: '0.9rem',
      outline: 'none',
      cursor: 'pointer'
    },
    impactSection: {
      backgroundColor: '#0f172a',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px'
    },
    impactTitle: {
      color: '#22c55e',
      fontSize: '1.2rem',
      marginBottom: '16px',
      fontWeight: '600'
    },
    impactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    impactCard: {
      backgroundColor: '#1e293b',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'left'
    },
    impactLabel: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      marginBottom: '4px'
    },
    impactValue: {
      color: '#f8fafc',
      fontSize: '1.4rem',
      fontWeight: '600'
    },
    note: {
      color: '#64748b',
      fontSize: '0.8rem',
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#1e293b',
      borderRadius: '6px',
      lineHeight: '1.4'
    }
  };

  return (
    <div style={styles.mainContent}>
      <h1 style={styles.title}>Environmental Impact Calculator</h1>
      
      <div style={styles.calculatorContainer}>
        <div style={styles.inputSection}>
          <div>
            <label style={styles.inputLabel}>Investment Amount ($)</label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="Enter amount"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.inputLabel}>Investment Duration (Years)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={styles.select}
            >
              {[1, 2, 3, 4, 5, 10, 15, 20].map(year => (
                <option key={year} value={year}>
                  {year} {year === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.inputLabel}>Investment Sector</label>
            <select
              value={fundType}
              onChange={(e) => setFundType(e.target.value)}
              style={styles.select}
            >
              <option value="environmental">Environmental Fund</option>
              <option value="social">Social Impact Fund</option>
              <option value="governance">Governance Fund</option>
            </select>
          </div>
        </div>

        <div style={styles.impactSection}>
          <h2 style={styles.impactTitle}>Your Environmental Impact</h2>
          <div style={styles.impactGrid}>
            <div style={styles.impactCard}>
              <div style={styles.impactLabel}>CO2 Reduction</div>
              <div style={styles.impactValue}>{impact.co2} tons</div>
            </div>
            
            <div style={styles.impactCard}>
              <div style={styles.impactLabel}>Water Saved</div>
              <div style={styles.impactValue}>{impact.water.toLocaleString()} L</div>
            </div>

            <div style={styles.impactCard}>
              <div style={styles.impactLabel}>Clean Energy Generated</div>
              <div style={styles.impactValue}>{impact.energy.toLocaleString()} kWh</div>
            </div>

            <div style={styles.impactCard}>
              <div style={styles.impactLabel}>Lives Impacted</div>
              <div style={styles.impactValue}>{impact.social} people</div>
            </div>
          </div>
        </div>

        <div style={styles.note}>
          Note: These calculations are estimates based on industry averages. Actual environmental impact may vary based on specific projects and implementation.
        </div>
      </div>
    </div>
  );
};

export default ImpactCalculator; 