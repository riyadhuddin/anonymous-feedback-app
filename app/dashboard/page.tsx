'use client'

import { useState, useEffect } from 'react'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { useRouter } from 'next/navigation'
import { listFeedbacks } from '@/graphql/queries'
import FeedbackCard from '@/components/feedback/FeedbackCard'
import ShareCard from '@/components/feedback/ShareCard'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const router = useRouter()
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  async function checkAuth() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
      fetchFeedbacks(currentUser.username)
    } catch (err) {
      router.push('/auth/login')
    }
  }
  
  async function fetchFeedbacks(userId: string) {
    setLoading(true)
    try {
      const result: any = await API.graphql(graphqlOperation(listFeedbacks, {
        filter: { userId: { eq: userId } },
        limit: 100,
        sortDirection: 'DESC',
      }))
      
      setFeedbacks(result.data.listFeedbacks.items)
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching feedback')
    } finally {
      setLoading(false)
    }
  }
  
  const handleRefresh = () => {
    if (user) {
      fetchFeedbacks(user.username)
    }
  }
  
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Feedback Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="btn btn-secondary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {user && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-primary-800">Your Public Profile</h2>
              <p className="text-primary-600">
                Share this link to receive anonymous feedback:
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/u/${user.username}`}
                  className="input bg-white border-r-0 rounded-r-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/u/${user.username}`)
                    alert('Link copied to clipboard!')
                  }}
                  className="btn btn-primary rounded-l-none"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
          
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {!loading && feedbacks.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">You haven't received any feedback yet.</p>
              <p className="text-gray-500">Share your profile link to start receiving feedback!</p>
            </div>
          )}
          
          {feedbacks.map(feedback => (
            <div key={feedback.id} onClick={() => setSelectedFeedback(feedback)}>
              <FeedbackCard 
                feedback={feedback} 
                onReplySubmitted={handleRefresh}
              />
            </div>
          ))}
        </div>
        
        <div>
          {selectedFeedback && user && (
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Share Your Response</h2>
              <ShareCard 
                feedback={selectedFeedback}
                username={user.username}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
