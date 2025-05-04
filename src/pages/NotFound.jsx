import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Earth, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="inline-block p-4 bg-explorer-100 rounded-full mb-6">
            <Earth className="h-16 w-16 text-explorer-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-medium text-gray-700 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-explorer-600 text-white rounded-md hover:bg-explorer-700 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
