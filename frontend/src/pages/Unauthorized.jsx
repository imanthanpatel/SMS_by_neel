import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md">
        <div className="text-6xl mb-5">🚫</div>
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500 mt-3">
          You don't have permission to access this page.
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
