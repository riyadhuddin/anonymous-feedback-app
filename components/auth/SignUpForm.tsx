'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from 'aws-amplify'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

type FormData = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm<FormData>()
  
  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
        },
      })
      setShowConfirmation(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }
  
  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await Auth.confirmSignUp(getValues('username'), confirmationCode)
      router.push('/auth/login?verified=true')
    } catch (err: any) {
      setError(err.message || 'An error occurred during confirmation')
    } finally {
      setLoading(false)
    }
  }
  
  const resendConfirmationCode = async () => {
    try {
      await Auth.resendSignUp(getValues('username'))
      alert('Confirmation code resent successfully')
    } catch (err: any) {
      setError(err.message || 'An error occurred while resending the code')
    }
  }
  
  return (
    <div className="card max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create an Account</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!showConfirmation ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input"
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, underscores and hyphens' }
              })}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('password') || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleConfirmation}>
          <p className="mb-4 text-gray-700">
            We've sent a confirmation code to your email. Please enter it below to verify your account.
          </p>
          
          <div className="mb-4">
            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Code
            </label>
            <input
              id="confirmationCode"
              type="text"
              className="input"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full mb-2"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={resendConfirmationCode}
          >
            Resend Code
          </button>
        </form>
      )}
    </div>
  )
}
