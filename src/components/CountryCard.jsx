"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Star, MapPin } from "lucide-react"
import { isAuthenticated, getCurrentUser, addFavoriteCountry, removeFavoriteCountry } from "../services/auth"

export default function CountryCard({ country }) {
  const user = getCurrentUser()
  const isFavorite = user?.favoriteCountries.includes(country.cca3) || false
  const [favorite, setFavorite] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population)
  }

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated()) {
      alert("Please login to save favorite countries")
      return
    }

    setIsLoading(true)
    try {
      if (favorite) {
        await removeFavoriteCountry(country.cca3)
        setFavorite(false)
      } else {
        await addFavoriteCountry(country.cca3)
        setFavorite(true)
      }
    } catch (error) {
      console.error("Failed to update favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link
      to={`/country/${country.cca3}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={country.flags.svg || "/placeholder.svg"}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {isAuthenticated() && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm ${
              favorite 
                ? "bg-yellow-400/90 text-yellow-900 hover:bg-yellow-400" 
                : "bg-white/80 text-gray-500 hover:text-yellow-500 hover:bg-white/90"
            } transition-all duration-300 shadow-sm`}
          >
            <Star className="h-5 w-5" fill={favorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
          {country.name.common}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          {country.capital && country.capital.length > 0 && (
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
              {country.capital[0]}
            </p>
          )}
          <p className="flex items-center">
            <span className="font-medium mr-2">Region:</span>
            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">
              {country.region}
            </span>
          </p>
          <p className="flex items-center">
            <span className="font-medium mr-2">Population:</span>
            <span className="text-gray-800">{formatPopulation(country.population)}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
