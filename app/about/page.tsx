import React from 'react'
import ContainerLayout from '../layouts/ContainerLayout'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
  <ContainerLayout>
    <div className='px-4 sm:px-12'>
      <div className='text-center mb-15'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10'>About my blogs</h1>
        <p className='text-gray-300 max-w-2xl mx-auto leading-relaxed'>A modern tech blog real world development and thoutfull engineering</p>

      </div>
      <div>
        
      </div>
      <div className='space-y-14'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
          <div >
           
          <Image src="/me.jpg" alt="about image" height={500} width={500}/>
          </div>
          <ul className='space-y-3 text-gray-300'>
            <li><h2 className='text-2xl font-semibold text-gray-200 mb-4'>what we write about</h2></li>
            <li>modern web technologies and frameworks</li>
             <li>Front end development with react next js and tailwind css</li>
             <li>back end development tools apis and application architecture </li>
             <li>practical guides and insights for web applications</li>
          </ul>
        </div>

      </div>
      <div className='text-center'>
      <h2 className='text-2xl font-semibold text-gray-200 mb-4'>biult for developers</h2>
      <p className='font-semibold text-gray-200 mb-4'>whether you are just starting out or refining your skills myblog is designed to inspire better code for better thinking</p>
      <Link href="/articles" className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-400 hover:bg-indigo-700 transition-colors text-white font-semibold'>Explore</Link>
      </div>
    </div>
  </ContainerLayout>
  )
}
