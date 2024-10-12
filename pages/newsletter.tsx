import Nav from '@/components/Nav'
import NewsletterComponent from '@/components/Newsletter'
import Blogs from '@/components/blogs'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const index = () => {
  const router = useRouter()
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-screen h-screen overflow-hidden bg-white flex flex-row'>
        <Nav />
        <NewsletterComponent />
    </div>
  )
}

export default index