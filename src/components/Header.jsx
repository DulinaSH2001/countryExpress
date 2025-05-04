import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, Menu, X, Earth, LogIn, User } from "lucide-react"
import { isAuthenticated, logout, getCurrentUser } from "../services/auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const user = getCurrentUser()
  const authenticated = isAuthenticated()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <Earth className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              WorldWise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-600 hover:text-indigo-600 transition-colors ${
                location.pathname === "/" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-gray-600 hover:text-indigo-600 transition-colors ${
                location.pathname === "/explore" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              Explore
            </Link>
            {authenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span>{user?.username}</span>
                </button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                  <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg mx-2">
                    My Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg mx-2"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search for a country..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <button
                onClick={() => {
                  toggleSearch()
                  setIsMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
              >
                Search
              </button>
              {authenticated ? (
                <>
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
