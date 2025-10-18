import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function HistoryPage() {
  const { asin } = useParams();  
  const [history, setHistory] = useState([]);
  const [flashMessage, setFlashMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
     try {
  const res = await axios.get(`http://localhost:5000/api/history/${asin}`);
  if (res.data.data.length === 0) {
    setFlashMessage(`No history found for ASIN: ${asin}`);
  } else {
    setHistory(res.data.data);
  }
} catch (err) {
  if (err.response?.status === 404) {
    setFlashMessage(`No history found for ASIN: ${asin}`);
  } else {
    setFlashMessage("⚠️ Server error. Please try again later.");
  }
}

    };

    if (asin) fetchHistory();
  }, [asin]);

  return (
    <div className="p-6 relative">
      {flashMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {flashMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">📜 History</h1>

      {history.length > 0 && (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id} className="border p-3 rounded-md shadow bg-white">
              <strong>ASIN:</strong> {item.asin} <br />
              <strong>Optimized Title:</strong> {item.optimized_title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoryPage;
