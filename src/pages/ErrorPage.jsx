import { useNavigate } from "react-router-dom"; // Using useNavigate for React Router v6+

const ErrorPage = () => {
  const navigate = useNavigate(); // Using useNavigate for navigating

  const handleGoHome = () => {
    navigate("/"); // Navigates to the homepage
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="text-center p-8 rounded-xl shadow-2xl max-w-lg mx-auto bg-gradient-to-t from-white via-gray-50 to-gray-100">
        <h1 className="text-5xl font-bold text-gray-700 mb-6">
          Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          It looks like something went wrong. Don't worry, we're on it!
        </p>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 border-4 border-t-4 border-gray-500 border-dotted rounded-full animate-spin"></div>
        </div>
        <p className="text-xl text-gray-500 mb-6">
          Try again, or head back to the homepage.
        </p>
        <div>
          <button
            onClick={handleGoHome}
            className="px-8 py-4 bg-blue-600 text-green-700 rounded-full shadow-md transform transition duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
