import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getCountryByCode, getCountriesByRegion } from "../services/api"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { ArrowLeft, Globe, MapPin, Users, DollarSign, Clock, Star, Map, Languages, Flag, Info } from "lucide-react"
import { isAuthenticated, getCurrentUser, toggleFavorite } from "../services/auth"

export default function CountryDetails() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [country, setCountry] = useState(null)
  const [neighbors, setNeighbors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setIsLoading(true)
        const data = await getCountryByCode(code)
        if (data && data.length > 0) {
          setCountry(data[0])
          const user = getCurrentUser()
          if (user) {
            setIsFavorite(user.favoriteCountries.includes(data[0].cca2))
          }
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

    fetchCountry()
  }, [code])

  useEffect(() => {
    const fetchNeighbors = async () => {
      if (country && country.borders && country.borders.length > 0) {
        try {
          const neighborData = await getCountriesByRegion(country.region)
          const filteredNeighbors = neighborData.filter(
            (c) => c.cca2 !== country.cca2 && country.borders.includes(c.cca2),
          )
          setNeighbors(filteredNeighbors)
        } catch (err) {
          console.error("Failed to fetch neighboring countries:", err)
        }
      }
    }

    fetchNeighbors()
  }, [country])

  const handleFavoriteToggle = () => {
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }
    toggleFavorite(country.cca2)
    setIsFavorite(!isFavorite)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <Globe className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
            </div>
            <p className="text-gray-600">Loading country details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Country Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The country you're looking for doesn't exist."}</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-explorer-600 text-white rounded-full hover:bg-explorer-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
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
        <div className="relative h-96">
          <img
            src={country.flags.png}
            alt={`${country.name.common} flag`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{country.name.common}</h1>
                  <p className="text-white/90 text-lg">{country.name.official}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                      isFavorite
                        ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <Star className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Information */}
            <div className="lg:col-span-8 space-y-8">
              {/* Overview Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-explorer-50 rounded-full p-2">
                    <Info className="h-6 w-6 text-explorer-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Capital</h3>
                        <p className="text-gray-600">{country.capital?.[0] || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Region</h3>
                        <p className="text-gray-600">{country.region}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Population</h3>
                        <p className="text-gray-600">{country.population.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <DollarSign className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Currency</h3>
                        <p className="text-gray-600">
                          {country.currencies
                            ? Object.values(country.currencies)
                                .map((c) => `${c.name} (${c.symbol})`)
                                .join(", ")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Time Zone</h3>
                        <p className="text-gray-600">{country.timezones?.[0] || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Languages className="h-6 w-6 text-explorer-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-700">Languages</h3>
                        <p className="text-gray-600">
                          {country.languages
                            ? Object.values(country.languages).join(", ")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-explorer-50 rounded-full p-2">
                    <Flag className="h-6 w-6 text-explorer-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Technical Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Area</h3>
                      <p className="text-gray-600">{country.area.toLocaleString()} km²</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Calling Code</h3>
                      <p className="text-gray-600">+{country.idd.root + (country.idd.suffixes?.[0] || "")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Driving Side</h3>
                      <p className="text-gray-600 capitalize">{country.car.side}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Internet TLD</h3>
                      <p className="text-gray-600">{country.tld?.[0] || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">ISO 3166-1 alpha-2</h3>
                      <p className="text-gray-600">{country.cca2}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">ISO 3166-1 alpha-3</h3>
                      <p className="text-gray-600">{country.cca3}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neighboring Countries */}
              {neighbors.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-explorer-50 rounded-full p-2">
                      <Globe className="h-6 w-6 text-explorer-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Neighboring Countries</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {neighbors.map((neighbor) => (
                      <Link
                        key={neighbor.cca2}
                        to={`/country/${neighbor.cca2}`}
                        className="group block"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-gray-100">
                          <img
                            src={neighbor.flags.png}
                            alt={`${neighbor.name.common} flag`}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-medium text-gray-800 group-hover:text-explorer-600 transition-colors">
                            {neighbor.name.common}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-4 space-y-8">
              {/* Map Link */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="bg-explorer-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Map className="h-8 w-8 text-explorer-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">View on Map</h2>
                <p className="text-gray-600 mb-4">Explore this country on Google Maps</p>
                <a
                  href={`https://www.google.com/maps/place/${country.name.common}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-explorer-600 text-white rounded-full hover:bg-explorer-700 transition-colors"
                >
                  Open in Maps
                </a>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-explorer-50 rounded-full p-2">
                    <Info className="h-6 w-6 text-explorer-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Quick Facts</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Official Name</h3>
                    <p className="text-gray-600">{country.name.official}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Region</h3>
                    <p className="text-gray-600">{country.region}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Subregion</h3>
                    <p className="text-gray-600">{country.subregion || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 