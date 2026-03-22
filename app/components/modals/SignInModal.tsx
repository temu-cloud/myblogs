"use client";
import { useModalStore } from '@/app/store/useModalStore'
 
import Modal from './Modal'
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { authClient } from '@/app/lib/auth-client';
 

export default function SignInModal() {
    const {isSignInOpen,closeSignIn}=useModalStore()
    const signInwithGoogle=async()=>{
      await authClient.signIn.social({
        provider:("google")
      })
    }
        const signInwithGitHub=async()=>{
      await authClient.signIn.social({
        provider:("github")
      })
    }
  return (
     <Modal isOpen={isSignInOpen } onClose={closeSignIn}>
        <h2 className='text-xl text-background font-semibold mb-2'>signin to myblogs</h2>
        <p className='text-sm text-gray-500 mb-8'>continue with google or github</p>
       <div className='space-y-4'>
          <button onClick={
            signInwithGoogle
          } className='w-full flex items-center justify-center gap-3 py-3 rounded-2xl cursor-pointer border border-background text-background'>
            <FaGoogle className='text-xl'/>continue with google
        </button>
        <button onClick={signInwithGitHub} className='w-full flex items-center justify-center gap-3 py-3 rounded-2xl cursor-pointer border border-background'>
            <FaGithub/>continue with github
        </button>
       </div>
     </Modal>
  )
}
