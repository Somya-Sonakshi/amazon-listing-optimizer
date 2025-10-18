import React, { useState } from "react";

function OptimizeForm({ onSubmit, loading }) {
  const [asin, setAsin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!asin.trim()) {
      alert("Please enter an ASIN");
      return;
    }
    onSubmit(asin.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-start mb-8 gap-4 w-full"
    >
      <input
        type="text"
        placeholder="🔎 Enter ASIN (e.g., B0DFHL7VDX)"
        value={asin}
        onChange={(e) => setAsin(e.target.value)}
        className={`border border-gray-300 p-6 rounded-xl w-full sm:w-3/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
          asin ? "bg-white" : "bg-green-50"
        } text-gray-700 placeholder-gray-400`}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`text-white px-12 py-6 rounded-2xl shadow-md font-semibold transition-transform transform hover:scale-105 ${
          loading
            ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600"
        }`}
      >
        {loading ? "⏳ Optimizing..." : "🚀 Optimize Now"}
      </button>
    </form>
  );
}

export default OptimizeForm;
