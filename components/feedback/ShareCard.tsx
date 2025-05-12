'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'

type ShareCardProps = {
  feedback: {
    message: string
    tags?: string[]
    createdAt: string
    reply?: string
  }
  username: string
}

export default function ShareCard({ feedback, username }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const downloadImage = async () => {
    if (!cardRef.current) return
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      })
      
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `feedback-response-${Date.now()}.png`
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    }
  }
  
  const shareToTwitter = () => {
    const text = `Check out my response to anonymous feedback on my Anonymous Feedback page!`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }
  
  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank')
  }
  
  if (!feedback.reply) return null
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Share Your Response</h3>
      
      <div 
        ref={cardRef}
        className="card border-2 border-primary-100 overflow-hidden"
        style={{ maxWidth: '600px' }}
      >
        <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
          <h4 className="font-medium text-primary-800">@{username}'s Feedback Response</h4>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Anonymous Feedback:</h5>
            <p className="text-gray-800">{feedback.message}</p>
            
            {feedback.tags && feedback.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
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
          
          <div className="pt-4 border-t border-gray-100">
            <h5 className="text-sm font-medium text-gray-500 mb-2">My Response:</h5>
            <p className="text-gray-800">{feedback.reply}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={downloadImage}
          className="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </button>
        
        <button
          onClick={shareToTwitter}
          className="btn bg-[#1DA1F2] text-white hover:bg-[#1a91da] flex items-center"
        >
          Share on X
        </button>
        
        <button
          onClick={shareToLinkedIn}
          className="btn bg-[#0A66C2] text-white hover:bg-[#0958a8] flex items-center"
        >
          Share on LinkedIn
        </button>
      </div>
    </div>
  )
}
