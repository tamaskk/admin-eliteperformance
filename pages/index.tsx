import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import { useRouter } from 'next/router'

const index = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/blog-posts')
  }, [])

  return (
    <div>
      <Nav />
    </div>
  )
}

export default index