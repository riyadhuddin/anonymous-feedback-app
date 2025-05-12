'use client'

import { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { getUser } from '@/graphql/queries'
import FeedbackForm from '@/components/feedback/FeedbackForm'

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchUser()
  }, [])
  
  async function fetchUser() {
    setLoading(true)
    try {
      // First try to get user by username
      const result: any = await API.graphql(graphqlOperation(getUser, { username }))
      
      if (result.data.getUser) {
        setUser(result.data.getUser)
      } else {
        setError('User not found')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching user data')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  if (error || !user) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold mb-4">User Not Found</h2>
        <p className="text-gray-500">
          The user profile you're looking for doesn't exist or is no longer available.
        </p>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-8">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{username}</h1>
            {user.bio && (
              <p className="text-gray-600">{user.bio}</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-500">
            This is {username}'s anonymous feedback page. You can leave feedback below.
          </p>
        </div>
      </div>
      
      <FeedbackForm userId={user.id} username={username} />
    </div>
  )
}
