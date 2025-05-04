"use client"

import { useState, useEffect } from "react"
import CountryCard from "./CountryCard"
import { getAllCountries } from "../services/api"
import { Loader, Globe, RefreshCw } from "lucide-react"

export default function CountryList({ countries: propCountries, isLoading: propIsLoading, error: propError }) {
  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // If countries are provided as props, use those
    if (propCountries) {
      setCountries(propCountries)
      setIsLoading(propIsLoading || false)
      setError(propError || "")
      return
    }

    // Otherwise, fetch all countries
    const fetchCountries = async () => {
      try {
        setIsLoading(true)
        const data = await getAllCountries()
        setCountries(data)
        setError("")
      } catch (err) {
        setError("Failed to fetch countries. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [propCountries, propIsLoading, propError])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <Globe className="h-16 w-16 text-explorer-200 animate-pulse" />
          <Loader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-explorer-600 animate-spin" />
        </div>
        <p className="text-gray-500">Loading countries...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-explorer-600 text-white rounded-full hover:bg-explorer-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (countries.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="bg-explorer-50 rounded-2xl p-8 max-w-md mx-auto">
          <div className="bg-explorer-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 text-explorer-500" />
          </div>
          <p className="text-gray-800 text-lg font-medium mb-2">No countries found</p>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {countries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  )
}
