'use client'

import { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { updateFeedback } from '@/graphql/mutations'
import { formatDistanceToNow } from 'date-fns'

type FeedbackCardProps = {
  feedback: {
    id: string
    message: string
    tags?: string[]
    createdAt: string
    reply?: string
  }
  onReplySubmitted?: () => void
}

export default function FeedbackCard({ feedback, onReplySubmitted }: FeedbackCardProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState(feedback.reply || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleReply = async () => {
    if (!replyText.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      await API.graphql(graphqlOperation(updateFeedback, {
        input: {
          id: feedback.id,
          reply: replyText
        }
      }))
      
      setIsReplying(false)
      if (onReplySubmitted) {
        onReplySubmitted()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your reply')
    } finally {
      setLoading(false)
    }
  }
  
  const formattedDate = formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })
  
  return (
    <div className="card mb-4">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-500">
            Received {formattedDate}
          </div>
          {feedback.tags && feedback.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {feedback.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-800 whitespace-pre-line">{feedback.message}</p>
      </div>
      
      {feedback.reply && !isReplying && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Reply:</h4>
          <p className="text-gray-800 whitespace-pre-line">{feedback.reply}</p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setIsReplying(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Edit Reply
            </button>
          </div>
        </div>
      )}
      
      {!feedback.reply && !isReplying && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsReplying(true)}
            className="btn btn-secondary"
          >
            Reply
          </button>
        </div>
      )}
      
      {isReplying && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <textarea
            className="input mb-3"
            rows={3}
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          ></textarea>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsReplying(false)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              className="btn btn-primary"
              disabled={loading || !replyText.trim()}
            >
              {loading ? 'Saving...' : 'Save Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
