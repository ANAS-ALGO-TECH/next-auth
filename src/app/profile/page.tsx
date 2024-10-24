'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import React, { useEffect, useState } from 'react'

export const ProfilePage = () => {
  const router = useRouter()
  const [data, setData] = useState('nothing')

  const getUserDetails = async () => {
    try {
      const res = await axios.post('/api/users/me')
      console.log(res.data.data)
      setData(res.data.data._id)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      const res = await axios.get('/api/users/logout')
      toast.success('logout')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile Page</h1>
      <hr />

      <h1>
        {data === 'nothing' ? (
          'Nothing'
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h1>
      <hr />

      <button
        className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={logout}
      >
        logout
      </button>
      <button
        className='bg-green-500 mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        onClick={getUserDetails}
      >
        Get user details
      </button>
    </div>
  )
}

export default ProfilePage
