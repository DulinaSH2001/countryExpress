"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CountryList from "../components/CountryList"
import FilterBar from "../components/FilterBar"
import SearchBar from "../components/SearchBar"
import { getAllCountries, getCountriesByRegion, getCountriesByLanguage, getCountryByName } from "../services/api"

export default function ExplorePage() {
  const [allCountries, setAllCountries] = useState([])
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")

  // Fetch all countries on mount for language filter options
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true)
        const data = await getAllCountries()
        setAllCountries(data)
        setDisplayedCountries(data)
        setError("")
      } catch (err) {
        setError("Failed to fetch countries. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Apply filters whenever they change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setIsLoading(true)
        let result = []

        // If we have a search query, use name search first
        if (searchQuery) {
          result = await getCountryByName(searchQuery)
        }
        // Otherwise if we have a region, use region filter
        else if (selectedRegion) {
          result = await getCountriesByRegion(selectedRegion)
        }
        // Otherwise if we have just language, use language filter
        else if (selectedLanguage) {
          result = await getCountriesByLanguage(selectedLanguage)
        }
        // Otherwise show all countries
        else {
          result = [...allCountries]
        }

        // Apply additional language filter if both search/region and language are selected
        if ((searchQuery || selectedRegion) && selectedLanguage) {
          const lang = selectedLanguage.toLowerCase()
          result = result.filter(
            (country) =>
              country.languages &&
              Object.values(country.languages).some((language) => language.toLowerCase().includes(lang)),
          )
        }

        setDisplayedCountries(result)
        setError("")
      } catch (err) {
        setError("Failed to filter countries. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    applyFilters()
  }, [searchQuery, selectedRegion, selectedLanguage, allCountries])

  const handleRegionChange = (region) => {
    setSelectedRegion(region)
    setSearchQuery("")
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
  }

  const handleFilterReset = () => {
    setSelectedRegion("")
    setSelectedLanguage("")
    setSearchQuery("")
  }

  // Extract unique languages for filter dropdown
  const getAllUniqueLanguages = () => {
    const languages = new Set()
    allCountries.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang) => languages.add(lang))
      }
    })
    return Array.from(languages).sort()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Explore Countries</h1>
          <p className="text-gray-600">
            Discover countries from around the world. Use filters and search to find specific countries.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar defaultValue={searchQuery} redirectOnSearch={true} />
        </div>

        <FilterBar
          onRegionChange={handleRegionChange}
          onLanguageChange={handleLanguageChange}
          onReset={handleFilterReset}
          selectedRegion={selectedRegion}
          allLanguages={getAllUniqueLanguages()}
        />

        <CountryList countries={displayedCountries} isLoading={isLoading} error={error} />
      </main>

      <Footer />
    </div>
  )
}
