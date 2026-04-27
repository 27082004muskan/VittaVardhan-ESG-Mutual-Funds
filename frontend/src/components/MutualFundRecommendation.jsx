import { useState } from "react";
import axios from "axios";
import { FaBrain, FaChartLine, FaSpinner, FaBullseye } from "react-icons/fa";

const initialForm = {
  age: "",
  monthlyIncome: "",
  monthlyInvestment: "",
  riskProfile: "moderate",
  investmentHorizonYears: "",
  goal: "wealth_creation",
};

const goalOptions = [
  { value: "wealth_creation", label: "Wealth Creation" },
  { value: "retirement", label: "Retirement" },
  { value: "tax_saving", label: "Tax Saving" },
  { value: "child_education", label: "Child Education" },
  { value: "house_purchase", label: "House Purchase" },
];

const MutualFundRecommendation = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecommendations([]);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5001/api/mutual-fund/recommend", {
        age: Number(formData.age),
        monthlyIncome: Number(formData.monthlyIncome),
        monthlyInvestment: Number(formData.monthlyInvestment),
        riskProfile: formData.riskProfile,
        investmentHorizonYears: Number(formData.investmentHorizonYears),
        goal: formData.goal,
      });

      const recs = response.data?.recommendations || [];
      setRecommendations(Array.isArray(recs) ? recs : []);
      if (!recs || recs.length === 0) {
        setError("No recommendations returned by your ML model.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Failed to fetch recommendations. Ensure backend and ML model service are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
            <FaBrain />
            Mutual Fund Recommendation (ML)
          </h2>
          <p className="text-gray-300 mt-2">
            Enter investor profile details to get personalized recommendations from your ML model.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaBullseye className="text-emerald-400" />
              Investor Inputs
            </h3>

            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              placeholder="Monthly Income (INR)"
              value={formData.monthlyIncome}
              onChange={(e) => updateField("monthlyIncome", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              placeholder="Monthly Investment (INR)"
              value={formData.monthlyInvestment}
              onChange={(e) => updateField("monthlyInvestment", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <select
              value={formData.riskProfile}
              onChange={(e) => updateField("riskProfile", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
            >
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>

            <input
              type="number"
              placeholder="Investment Horizon (years)"
              value={formData.investmentHorizonYears}
              onChange={(e) => updateField("investmentHorizonYears", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <select
              value={formData.goal}
              onChange={(e) => updateField("goal", e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
            >
              {goalOptions.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Getting Recommendations...
                </span>
              ) : (
                "Get Recommendations"
              )}
            </button>
          </form>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FaChartLine className="text-emerald-400" />
              Recommended Funds
            </h3>

            {error && (
              <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-200 mb-4">
                {error}
              </div>
            )}

            {recommendations.length === 0 && !loading ? (
              <p className="text-gray-400">
                Recommendations will appear here after you submit profile details.
              </p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((item, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <p className="font-semibold text-emerald-300">
                      {item.fundName || item.name || `Fund #${idx + 1}`}
                    </p>
                    {item.reason && <p className="text-gray-300 text-sm mt-1">{item.reason}</p>}
                    {item.score !== undefined && (
                      <p className="text-sm text-gray-400 mt-2">Model Score: {item.score}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutualFundRecommendation;

