import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-28 pb-16 bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
