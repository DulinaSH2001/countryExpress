"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getCountryByName } from "../services/api"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CountryList from "../components/CountryList"
import SearchBar from "../components/SearchBar"
import { ArrowLeft } from "lucide-react"

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setCountries([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await getCountryByName(query)
        setCountries(data)
        setError("")
      } catch (err) {
        setError("No countries found matching your search")
        setCountries([])
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-explorer-600 hover:text-explorer-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Previous Page
          </button>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Search Results for "{query}"</h1>
          <p className="text-gray-600">
            {isLoading ? "Searching countries..." : `Found ${countries.length} countries matching your search`}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar defaultValue={query} showSuggestions={false} />
        </div>

        <CountryList countries={countries} isLoading={isLoading} error={error} />
      </main>

      <Footer />
    </div>
  )
}
