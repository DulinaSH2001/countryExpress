"use client"

import { useState, useEffect, useRef } from "react"
import { Filter, ChevronDown, X } from "lucide-react"

export default function FilterBar({
  onRegionChange,
  onLanguageChange,
  onReset,
  selectedRegion = "",
  allLanguages = [],
}) {
  const [regionsOpen, setRegionsOpen] = useState(false)
  const [languagesOpen, setLanguagesOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [currentRegion, setCurrentRegion] = useState("")

  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"]

  const regionRef = useRef(null)
  const languageRef = useRef(null)

  const handleRegionSelect = (region) => {
    const newRegion = region === currentRegion ? "" : region
    setCurrentRegion(newRegion)
    onRegionChange(newRegion)
    setRegionsOpen(false)
  }

  const handleLanguageSelect = (language) => {
    const newLanguage = language === selectedLanguage ? "" : language
    setSelectedLanguage(newLanguage)
    onLanguageChange(newLanguage)
    setLanguagesOpen(false)
  }

  const handleReset = () => {
    setCurrentRegion("")
    setSelectedLanguage("")
    onReset()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        regionRef.current &&
        !regionRef.current.contains(event.target) &&
        languageRef.current &&
        !languageRef.current.contains(event.target)
      ) {
        setRegionsOpen(false)
        setLanguagesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
      <div className="flex items-center">
        <Filter className="h-5 w-5 text-indigo-500 mr-2" />
        <span className="text-gray-700 font-medium">Filters:</span>
        {(selectedRegion || selectedLanguage) && (
          <button
            onClick={handleReset}
            className="ml-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1 rounded-full transition-colors"
          >
            Reset <X className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        {/* Region Filter */}
        <div className="relative" ref={regionRef}>
          <button
            className={`flex items-center justify-between px-4 py-2.5 w-full sm:w-48 border rounded-xl ${
              regionsOpen ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200"
            } ${currentRegion ? "bg-indigo-50 text-indigo-700" : "bg-white/80 backdrop-blur-sm text-gray-600"}`}
            onClick={() => setRegionsOpen(!regionsOpen)}
          >
            <span className={currentRegion ? "text-indigo-700 font-medium" : "text-gray-600"}>
              {currentRegion || "Select Region"}
            </span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${
                regionsOpen ? "transform rotate-180 text-indigo-600" : "text-gray-400"
              }`} 
            />
          </button>

          {regionsOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {regions.map((region) => (
                <button
                  key={region}
                  className={`block w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    currentRegion === region ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"
                  }`}
                  onClick={() => handleRegionSelect(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Filter */}
        <div className="relative" ref={languageRef}>
          <button
            className={`flex items-center justify-between px-4 py-2.5 w-full sm:w-48 border rounded-xl ${
              languagesOpen ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-200"
            } ${selectedLanguage ? "bg-indigo-50 text-indigo-700" : "bg-white/80 backdrop-blur-sm text-gray-600"}`}
            onClick={() => setLanguagesOpen(!languagesOpen)}
          >
            <span className={selectedLanguage ? "text-indigo-700 font-medium" : "text-gray-600"}>
              {selectedLanguage || "Select Language"}
            </span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${
                languagesOpen ? "transform rotate-180 text-indigo-600" : "text-gray-400"
              }`} 
            />
          </button>

          {languagesOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {allLanguages.map((language) => (
                <button
                  key={language}
                  className={`block w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    selectedLanguage === language ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"
                  }`}
                  onClick={() => handleLanguageSelect(language)}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
