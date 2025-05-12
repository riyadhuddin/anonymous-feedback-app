'use client'

import { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createFeedback } from '@/graphql/mutations'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

const TAGS = [
  'kindness',
  'creativity',
  'leadership',
  'communication',
  'teamwork',
  'technical',
  'growth',
  'improvement'
]

type FormData = {
  message: string
  tags: string[]
}

type FeedbackFormProps = {
  userId: string
  username: string
}

export default function FeedbackForm({ userId, username }: FeedbackFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }
  
  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      const feedbackInput = {
        id: uuidv4(),
        userId,
        message: data.message,
        tags: selectedTags,
        createdAt: new Date().toISOString()
      }
      
      await API.graphql(graphqlOperation(createFeedback, { input: feedbackInput }))
      
      setSuccess(true)
      reset()
      setSelectedTags([])
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting feedback')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Leave Anonymous Feedback for {username}</h2>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Your feedback has been submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="input"
            placeholder="Share your honest feedback..."
            {...register('message', { 
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
              maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' }
            })}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-100 text-primary-800 border border-primary-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Your feedback will be completely anonymous.
          </p>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  )
}
