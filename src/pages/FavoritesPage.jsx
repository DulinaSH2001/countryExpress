"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getCountryByCode } from "../services/api"
import { isAuthenticated, getCurrentUser } from "../services/auth"
import CountryList from "../components/CountryList"
import { Loader, Star, Globe } from "lucide-react"

export default function FavoritesPage() {
  const [favoriteCountries, setFavoriteCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadFavorites = async () => {
      const user = getCurrentUser()
      if (!user || user.favoriteCountries.length === 0) {
        setFavoriteCountries([])
        setIsLoading(false)
        return
      }

      try {
        const countriesData = []

        // Fetch each country by code
        for (const code of user.favoriteCountries) {
          try {
            const data = await getCountryByCode(code)
            if (data && data.length > 0) {
              countriesData.push(data[0])
            }
          } catch (err) {
            console.error(`Error fetching country ${code}:`, err)
          }
        }

        setFavoriteCountries(countriesData)
      } catch (err) {
        setError("Failed to load favorite countries")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            </div>
            <p className="text-gray-600">Loading your favorite countries...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-yellow-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view and manage your favorite countries.</p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Favorite Countries</h1>
              <p className="text-xl text-white/90">
                {favoriteCountries.length === 0
                  ? "Start adding countries to your favorites to see them here."
                  : `You have ${favoriteCountries.length} favorite ${favoriteCountries.length === 1 ? "country" : "countries"}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {error ? (
            <div className="bg-red-50 rounded-2xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <Globe className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Error Loading Favorites</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : favoriteCountries.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="bg-gray-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
              <p className="text-gray-600 mb-6">
                Start exploring countries and add them to your favorites to see them here.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                Explore Countries
              </Link>
            </div>
          ) : (
            <CountryList countries={favoriteCountries} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
