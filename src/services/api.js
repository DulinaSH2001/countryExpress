const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllCountries() {
  const response = await fetch(`${BASE_URL}/all?fields=name,cca3,flags,capital,region,languages,population`)
  if (!response.ok) throw new Error("Failed to fetch countries")
  return response.json()
}

export async function getCountryByName(name) {
  const response = await fetch(`${BASE_URL}/name/${name}?fields=name,cca3,flags,capital,region,languages,population`)
  if (!response.ok) throw new Error(`Failed to fetch country with name: ${name}`)
  return response.json()
}

export async function getCountriesByRegion(region) {
  const response = await fetch(
    `${BASE_URL}/region/${region}?fields=name,cca3,flags,capital,region,languages,population`,
  )
  if (!response.ok) throw new Error(`Failed to fetch countries in region: ${region}`)
  return response.json()
}

export async function getCountriesByLanguage(lang) {
  const response = await fetch(`${BASE_URL}/lang/${lang}?fields=name,cca3,flags,capital,region,languages,population`)
  if (!response.ok) throw new Error(`Failed to fetch countries with language: ${lang}`)
  return response.json()
}

export async function getCountryByCode(code) {
  const response = await fetch(`${BASE_URL}/alpha/${code}`)
  if (!response.ok) throw new Error(`Failed to fetch country with code: ${code}`)
  return response.json()
}

// function for autocomplete suggestions
export async function getCountrySuggestions(query) {
  if (query.length < 2) return []
  const response = await fetch(`${BASE_URL}/name/${query}?fields=name,cca3,flags`)
  if (!response.ok) return []
  return response.json()
}
