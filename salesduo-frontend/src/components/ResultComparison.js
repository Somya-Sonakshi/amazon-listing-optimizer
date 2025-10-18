

function ResultComparison({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full max-w-5xl pl-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">📦 Original Content</h2>

        <p className="mb-3"><strong>📝 Title:</strong> {data.original_title}</p>
        <ul className="list-disc ml-6 text-gray-700">
          {data.original_bullets?.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <p className="mt-3"><strong>🧾 Description:</strong> {data.original_description}</p>

        {data.original_keywords?.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold text-gray-700">🔑 Keywords:</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {data.original_keywords.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition">
        <h2 className="text-2xl font-semibold mb-3 text-green-700">⚡ Optimized Content</h2>

        <p className="mb-3"><strong>🏷️ Title:</strong> {data.optimized_title}</p>
        <ul className="list-disc ml-6 text-gray-800">
          {data.optimized_bullets?.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <p className="mt-3"><strong>🪄 Description:</strong> {data.optimized_description}</p>

        {data.optimized_keywords?.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold text-green-700">🚀Keywords:</h3>
            <ul className="list-disc ml-6 text-gray-800">
              {data.optimized_keywords.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultComparison;
