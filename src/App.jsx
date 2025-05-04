import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import HomePage from "./pages/HomePage"
import ExplorePage from "./pages/ExplorePage"
import { initAuth } from "./services/auth"
import CountryDetailPage from "./pages/CountryDetailPage"
import RegionsPage from "./pages/RegionsPage"
import NotFound from "./pages/NotFound"
import SearchResultsPage from "./pages/SearchResultsPage"
import LoginPage from "./pages/LoginPage"
import FavoritesPage from "./pages/FavoritesPage"

const queryClient = new QueryClient()

function App() {
  // Initialize authentication from localStorage on app start
  useEffect(() => {
    initAuth()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/country/:code" element={<CountryDetailPage />} />
            <Route path="/regions" element={<RegionsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
