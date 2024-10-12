import Nav from '@/components/Nav'
import Blogs from '@/components/blogs'
import NewPostComponent from '@/components/newPost'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const NewPost = () => {
  return (
    <div className='w-screen h-screen overflow-hidden bg-white flex flex-row'>
      <SessionProvider>
        <Nav />
        <NewPostComponent />
      </SessionProvider>
    </div>
  )
}

export default NewPost