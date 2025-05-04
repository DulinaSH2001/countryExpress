import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Earth, ArrowRight, Globe } from "lucide-react"

export default function RegionsPage() {
  const regions = [
    {
      name: "Africa",
      description: "Explore the diverse countries and cultures of the African continent.",
      imageUrl: "africa.jpg",
      color: "from-yellow-500 to-orange-500",
      iconColor: "text-yellow-500",
    },
    {
      name: "America",
      description: "Discover countries from North, Central, and South America.",
      imageUrl: "americas.jpg",
      color: "from-red-500 to-purple-500",
      iconColor: "text-red-500",
    },
    {
      name: "Asia",
      description: "Explore the countries of the world's largest and most populous continent.",
      imageUrl: "asia.jpg",
      color: "from-green-500 to-teal-500",
      iconColor: "text-green-500",
    },
    {
      name: "Europe",
      description: "Visit the diverse countries of the European continent.",
      imageUrl: "europe.jpg",
      color: "from-blue-500 to-indigo-500",
      iconColor: "text-blue-500",
    },
    {
      name: "Oceania",
      description: "Discover the island countries of the Pacific Ocean.",
      imageUrl: "oceania.jpg",
      color: "from-cyan-500 to-blue-500",
      iconColor: "text-cyan-500",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore by Region</h1>
              <p className="text-xl text-white/90">
                Discover countries from different regions around the world. Click on a region to explore its countries.
              </p>
            </div>
          </div>
        </div>

        {/* Regions Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regions.map((region) => (
              <Link
                key={region.name}
                to={`/explore?region=${region.name}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                  <div className="relative h-64">
                    <img
                      src={region.imageUrl || "/placeholder.svg"}
                      alt={`${region.name} region`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-60`}></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                        <Earth className={`h-6 w-6 ${region.iconColor}`} />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">{region.name}</h2>
                      <p className="text-white/90 mb-4">{region.description}</p>
                      <div className="flex items-center text-white font-medium">
                        Explore Region
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
