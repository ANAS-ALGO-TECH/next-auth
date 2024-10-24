'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const SignUpPage = () => {
  const router = useRouter()
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

  const onSignUp = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/users/signup', user)
      console.log('Sign up success', response.data)
      router.push('/login')
    } catch (error: any) {
      console.log('Sign up failed')
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>{loading ? 'Processing' : 'Sign Up'}</h1>
      <hr />
      {/* username */}
      <label htmlFor='username'>Username</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
        id='username'
        value={user.username}
        onChange={e => setUser({ ...user, username: e.target.value })}
        type='text'
        placeholder='username'
      />
      {/* email */}
      <label htmlFor='email'>Email</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
        id='email'
        value={user.email}
        onChange={e => setUser({ ...user, email: e.target.value })}
        type='email'
        placeholder='email'
      />
      {/* password */}
      <label htmlFor='password'>Password</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
        id='password'
        value={user.password}
        onChange={e => setUser({ ...user, password: e.target.value })}
        type='password'
        placeholder='password'
      />
      {/* Submit button */}
      <button
        onClick={onSignUp}
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
      >
        {buttonDisabled ? 'No Sign up' : 'Sign Up'}
      </button>
      <Link href={'/login'}>Visit Login Page</Link>
    </div>
  )
}

export default SignUpPage
