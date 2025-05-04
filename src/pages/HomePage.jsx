"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import SearchBar from "../components/SearchBar"
import { getAllCountries } from "../services/api"
import { Earth, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { initAuth } from "../services/auth"

export default function HomePage() {
  const [featuredCountries, setFeaturedCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize authentication from localStorage if available
    initAuth()

    // Fetch some random countries for the featured section
    const fetchFeaturedCountries = async () => {
      try {
        const allCountries = await getAllCountries()

        // Get 3 random countries with population > 10 million for featured section
        const largePop = allCountries.filter((country) => country.population > 10000000)
        const shuffled = [...largePop].sort(() => 0.5 - Math.random())
        setFeaturedCountries(shuffled.slice(0, 3))
      } catch (error) {
        console.error("Error fetching featured countries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedCountries()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Earth className="h-20 w-20 text-indigo-200 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
            Discover Our World
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-indigo-100">
            Journey through countries, explore diverse cultures, and uncover fascinating facts about our planet
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar className="mb-6" />
            <div className="flex justify-center space-x-6">
              <Link
                to="/explore"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Start Exploring
              </Link>
              <Link
                to="/regions"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300"
              >
                Browse by Region
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Countries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Featured Destinations</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))
              : featuredCountries.map((country) => (
                  <Link
                    key={country.cca3}
                    to={`/country/${country.cca3}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={country.flags.svg || "/placeholder.svg"}
                        alt={`Flag of ${country.name.common}`}
                        className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {country.name.common}
                      </h3>
                      {country.capital && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                          <span>{country.capital[0]}</span>
                        </div>
                      )}
                      <p className="text-gray-600 mb-4">
                        <span className="font-medium">Region:</span> {country.region}
                      </p>
                      <button className="w-full px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-medium">
                        Explore Country
                      </button>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100">
            Dive into a world of discovery, learn about different cultures, and expand your global knowledge.
          </p>
          <Link
            to="/explore"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 font-medium"
          >
            Begin Your Journey
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
