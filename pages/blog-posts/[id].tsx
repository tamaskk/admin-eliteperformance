import EditPostComponent from '@/components/EditPostComponent'
import Nav from '@/components/Nav'
import { SessionProvider } from 'next-auth/react'

const NewPost = () => {
  return (
    <div className='w-screen h-screen overflow-hidden bg-white flex flex-row'>
      <SessionProvider>
        <Nav />
        <EditPostComponent />
      </SessionProvider>
    </div>
  )
}

export default NewPost