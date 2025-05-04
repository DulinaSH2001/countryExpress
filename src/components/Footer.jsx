import { Earth, Github, Mail, Globe, MapPin, Users } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-indigo-50 border-t border-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Earth className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WorldWise
              </span>
            </div>
            <p className="text-gray-600">
              Discover the world's countries, cultures, and fascinating facts in one place.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:ranuga01234@gmail.com"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/explore" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Explore Countries
                </a>
              </li>
              <li>
                <a href="/regions" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Browse by Region
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <Globe className="h-4 w-4 text-indigo-500" />
                <span>Country Information</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>Interactive Maps</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Cultural Insights</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 WorldWise. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Data provided by REST Countries API
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
