export default function Loader() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white p-10 rounded shadow space-y-3">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
