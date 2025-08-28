import { useState } from "react";

// Enhanced stock data with ESG scores
const stocks = [
  { 
    symbol: "TSLA", 
    name: "Tesla", 
    price: 200,
    esgScore: 85,
    sector: "Automotive",
    description: "Electric vehicles and clean energy"
  },
  { 
    symbol: "AAPL", 
    name: "Apple", 
    price: 180,
    esgScore: 82,
    sector: "Technology",
    description: "Technology with strong environmental initiatives"
  },
  {
    symbol: "ENPH",
    name: "Enphase Energy",
    price: 120,
    esgScore: 88,
    sector: "Clean Energy",
    description: "Solar energy solutions provider"
  }
];

export default function BuyStock() {
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleBuy = () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid investment amount!");
      return;
    }

    const shares = (parseFloat(amount) / selectedStock.price).toFixed(2);
    const newTransaction = {
      stock: selectedStock.name,
      symbol: selectedStock.symbol,
      amount: parseFloat(amount),
      shares: shares,
      price: selectedStock.price,
      date: new Date().toLocaleString(),
    };

    setTransactions([newTransaction, ...transactions]); // Add new transaction at the beginning
    setAmount("");
  };

  const calculateTotalInvestment = () => {
    return transactions.reduce((total, tx) => total + tx.amount, 0).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sustainable Investment Simulator
        </h2>

        {/* Stock Selection */}
        <div className="grid gap-4 mb-6">
          <label className="text-gray-700 font-medium">Select Stock</label>
          <select 
            className="w-full p-2 border rounded-md bg-white"
            onChange={(e) => setSelectedStock(stocks[e.target.value])}
          >
            {stocks.map((stock, i) => (
              <option key={i} value={i}>
                {stock.name} (${stock.price}) - ESG Score: {stock.esgScore}
              </option>
            ))}
          </select>

          {/* Stock Details */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">{selectedStock.description}</p>
            <p className="text-sm text-gray-600 mt-2">Sector: {selectedStock.sector}</p>
          </div>
        </div>

        {/* Investment Amount Input */}
        <div className="grid gap-4 mb-6">
          <label className="text-gray-700 font-medium">Investment Amount ($)</label>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 p-2 border rounded-md"
              min="0"
            />
            <button 
              onClick={handleBuy}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Buy
            </button>
          </div>
          {amount && (
            <p className="text-sm text-gray-600">
              You will receive approximately {(amount / selectedStock.price).toFixed(2)} shares
            </p>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
          <p className="text-green-600 font-medium">
            Total Investment: ${calculateTotalInvestment()}
          </p>
        </div>
        
        <div className="space-y-4">
          {transactions.map((tx, i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {tx.stock} ({tx.symbol})
                  </p>
                  <p className="text-sm text-gray-600">
                    {tx.shares} shares @ ${tx.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">${tx.amount}</p>
                  <p className="text-sm text-gray-600">{tx.date}</p>
                </div>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No transactions yet. Start investing!
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 