// Simulated users database
const users = [
  {
    id: "1",
    username: "demo",
    email: "demo@example.com",
    favoriteCountries: ["USA", "CAN", "JPN"],
  },
  {
    id: "2",
    username: "test",
    email: "test@example.com",
    favoriteCountries: ["FRA", "ITA", "ESP"],
  },
]

// Mock token for authentication
let authToken = null
let currentUser = null

export function isAuthenticated() {
  return authToken !== null
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      const user = users.find((u) => u.username === username)

      // In a real app, you'd verify the password here
      if (user && password === "password") {
        authToken = `mock-token-${user.id}-${Date.now()}`
        currentUser = user
        localStorage.setItem("authToken", authToken)
        localStorage.setItem("user", JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 500)
  })
}

export function logout() {
  authToken = null
  currentUser = null
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
}

export function getCurrentUser() {
  if (!currentUser && localStorage.getItem("user")) {
    currentUser = JSON.parse(localStorage.getItem("user"))
  }
  return currentUser
}

export function addFavoriteCountry(countryCode) {
  return new Promise((resolve, reject) => {
    if (!isAuthenticated() || !currentUser) {
      reject(new Error("Not authenticated"))
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (currentUser && !currentUser.favoriteCountries.includes(countryCode)) {
        if (currentUser) {
          currentUser.favoriteCountries.push(countryCode)
        }
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
      if (currentUser) {
        resolve(currentUser)
      } else {
        reject(new Error("Current user is null"))
      }
    }, 300)
  })
}

export function removeFavoriteCountry(countryCode) {
  return new Promise((resolve, reject) => {
    if (!isAuthenticated() || !currentUser) {
      reject(new Error("Not authenticated"))
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (currentUser) {
        currentUser.favoriteCountries = currentUser.favoriteCountries.filter((code) => code !== countryCode)
        localStorage.setItem("user", JSON.stringify(currentUser))
        resolve(currentUser)
      } else {
        reject(new Error("Current user is null"))
      }
    }, 300)
  })
}

// Initialize from localStorage
export function initAuth() {
  const storedToken = localStorage.getItem("authToken")
  const storedUser = localStorage.getItem("user")

  if (storedToken && storedUser) {
    authToken = storedToken
    currentUser = JSON.parse(storedUser)
  }
}
