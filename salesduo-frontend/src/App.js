import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OptimizeForm from "./components/OptimizeForm";
import ResultComparison from "./components/ResultComparison";
import HistoryPage from "./components/HistoryPage";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const handleOptimize = async (asin) => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/optimize/${asin}`);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || " Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="p-12 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
        <nav className="flex gap-6 mb-8">
          <Link to="/" className="text-green-700 font-bold hover:underline">
            🏡 Home
          </Link>
          {/* History link will require an ASIN */}
          {data?.asin && (
            <Link
              to={`/history/${data.asin}`}
              className="text-green-700 font-bold hover:underline"
            >
              📜 History
            </Link>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-10 pl-4">
                  🛍️ Amazon Listing{" "}
                  <span className="text-green-600">Optimizer</span> ✨
                </h1>

                <div className="pl-4 w-full max-w-2xl">
                  <OptimizeForm onSubmit={handleOptimize} loading={loading} />
                </div>

                {error && (
                  <p className="text-red-600 text-lg font-medium pl-4 mt-2">
                    {error}
                  </p>
                )}

                {data && (
                  <div className="mt-8 w-full pl-4">
                    <ResultComparison data={data} />
                  </div>
                )}
              </div>
            }
          />

          {/* History requires an ASIN */}
          <Route path="/history/:asin" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
