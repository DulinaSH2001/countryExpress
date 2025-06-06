"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the home page
    navigate("/")
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-xl text-gray-600">Redirecting to home page...</p>
      </div>
    </div>
  )
}

export default Index
