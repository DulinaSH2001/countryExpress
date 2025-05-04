"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getCountryByCode } from "../services/api"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Globe, Users, MapPin, Languages, ArrowLeft, Star, Loader, MapIcon } from "lucide-react"
import { isAuthenticated, getCurrentUser, addFavoriteCountry, removeFavoriteCountry } from "../services/auth"

export default function CountryDetailPage() {
  const { code } = useParams()
  const [country, setCountry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const user = getCurrentUser()
  const isFavorite = user?.favoriteCountries.includes(code || "") || false
  const [favorite, setFavorite] = useState(isFavorite)

  useEffect(() => {
    const fetchCountryDetails = async () => {
      if (!code) {
        setError("Country code is required")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await getCountryByCode(code)
        if (data && data.length > 0) {
          setCountry(data[0])
          setError("")
        } else {
          setError("Country not found")
        }
      } catch (err) {
        setError("Failed to fetch country details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountryDetails()
  }, [code])

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population)
  }

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated()) {
      alert("Please login to save favorite countries")
      return
    }

    try {
      if (favorite && code) {
        await removeFavoriteCountry(code)
        setFavorite(false)
      } else if (code) {
        await addFavoriteCountry(code)
        setFavorite(true)
      }
    } catch (error) {
      console.error("Failed to update favorites:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader className="h-10 w-10 text-explorer-500 animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Error</h1>
          <p className="text-red-500 mb-6">{error || "Country not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-explorer-600 text-white rounded-md hover:bg-explorer-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Go Back
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const getLanguageNames = () => {
    if (!country.languages) return []
    return Object.values(country.languages)
  }

  const getCurrencyInfo = () => {
    if (!country.currencies) return "Not available"
    return Object.entries(country.currencies)
      .map(([code, { name, symbol }]) => `${name} (${symbol || code})`)
      .join(", ")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 flex items-center text-explorer-600 hover:text-explorer-800 mb-4 sm:mb-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          {isAuthenticated() && (
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-2 rounded-md flex items-center ${
                favorite
                  ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
            >
              <Star className="h-4 w-4 mr-2" fill={favorite ? "currentColor" : "none"} />
              {favorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-0 md:p-0 mb-8">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={country.flags.svg || "/placeholder.svg"}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{country.name.common}</h1>
              {country.capital && country.capital.length > 0 && (
                <div className="flex items-center text-white/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Capital: {country.capital.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Official Name:</span> {country.name.official}
                  </p>
                  {country.capital && (
                    <p className="text-gray-700">
                      <span className="font-medium">Capital:</span> {country.capital.join(", ")}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-medium">Region:</span> {country.region}
                  </p>
                  {country.subregion && (
                    <p className="text-gray-700">
                      <span className="font-medium">Subregion:</span> {country.subregion}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Population:</span> {formatPopulation(country.population)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Country Code:</span> {country.cca3} ({country.cca2})
                  </p>
                  {country.tld && country.tld.length > 0 && (
                    <p className="text-gray-700">
                      <span className="font-medium">Top-level Domain:</span> {country.tld.join(", ")}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-medium">Currency:</span> {getCurrencyInfo()}
                  </p>
                </div>
              </div>
            </section>

            {/* Languages and Additional Info */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Languages & Culture</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Languages className="h-5 w-5 text-explorer-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Languages</h3>
                    <p className="text-gray-700">
                      {getLanguageNames().length > 0 ? getLanguageNames().join(", ") : "Information not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 text-explorer-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Population</h3>
                    <p className="text-gray-700">{formatPopulation(country.population)} people</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-explorer-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Region</h3>
                    <p className="text-gray-700">
                      {country.region} {country.subregion ? `- ${country.subregion}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Link */}
            <section className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-3 text-gray-800">View on Map</h2>
              <MapIcon className="h-16 w-16 text-explorer-500 mx-auto mb-4" />
              <a
                href={`https://www.google.com/maps/place/${country.name.common}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-explorer-600 text-white rounded-md hover:bg-explorer-700 transition-colors"
              >
                Open in Google Maps
              </a>
            </section>

            {/* Bordering Countries */}
            {country.borders && country.borders.length > 0 && (
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Bordering Countries</h2>
                <div className="space-y-2">
                  {country.borders.map((border) => (
                    <Link
                      key={border}
                      to={`/country/${border}`}
                      className="block px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {border}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
