"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getCountrySuggestions } from "../services/api"

export default function SearchBar({
  defaultValue = "",
  onSearch,
  className = "",
  showSuggestions = true,
  redirectOnSearch = true,
}) {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        const data = await getCountrySuggestions(query)
        setSuggestions(data)
        setShowDropdown(data.length > 0)
      } else {
        setSuggestions([])
        setShowDropdown(false)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      if (redirectOnSearch) {
        // Always navigate to search results page when redirect is enabled
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      } else if (onSearch) {
        // Only call onSearch if redirect is disabled
        onSearch(trimmedQuery)
      }
    } else {
      navigate("/explore")
    }
    setShowDropdown(false)
  }

  const handleSuggestionClick = (country) => {
    setQuery(country.name.common)
    navigate(`/country/${country.cca3}`)
    setShowDropdown(false)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search for a country..."
          className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-white/80 backdrop-blur-sm shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {showSuggestions && showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {suggestions.map((country) => (
            <button
              key={country.cca3}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
              onClick={() => handleSuggestionClick(country)}
            >
              <img
                src={country.flags.svg || "/placeholder.svg"}
                alt={country.name.common}
                className="w-6 h-4 mr-3 object-cover rounded-sm"
              />
              <span className="text-gray-800">{country.name.common}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-explorer-600 text-white px-4 py-1.5 rounded-md hover:bg-explorer-700 transition-colors"
      >
        Search
      </button>
    </form>
  )
}
