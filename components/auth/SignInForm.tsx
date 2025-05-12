'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from 'aws-amplify'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

type FormData = {
  username: string
  password: string
}

export default function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  
  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    
    try {
      await Auth.signIn(data.username, data.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="card max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      
      {verified && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Your account has been verified successfully. Please sign in.
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="input"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="input"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
