// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-4 text-center">Welcome to ThinkVerge LMS</h1>
      <p className="mb-8 text-lg max-w-xl text-center">
        Learn, teach, and manage courses easily. Access your dashboard, track progress, and enroll in courses all in one place.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-200 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}