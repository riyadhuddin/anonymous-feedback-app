'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthState()
  }, [])

  async function checkAuthState() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setIsAuthenticated(true)
      setUsername(user.username)
    } catch (error) {
      setIsAuthenticated(false)
      setUsername('')
    }
  }

  async function handleSignOut() {
    try {
      await Auth.signOut()
      setIsAuthenticated(false)
      setUsername('')
      router.push('/')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Anonymous Feedback
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                  Dashboard
                </Link>
                <Link href={`/u/${username}`} className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                  My Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-2">
            <Link href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white py-2">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white py-2">
                  Dashboard
                </Link>
                <Link href={`/u/${username}`} className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white py-2">
                  My Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white py-2 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white py-2">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary inline-block w-full text-center">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
