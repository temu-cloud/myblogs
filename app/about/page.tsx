import React from 'react'
import ContainerLayout from '../layouts/ContainerLayout'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <ContainerLayout>
      <div className='px-4 sm:px-12'>
        <div className='text-center mb-15'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10'>About me</h1>
          <p className='text-gray-300 max-w-2xl mx-auto leading-relaxed'>I’m a Computer Engineer and Full-Stack Developer passionate about transforming ideas and real-world challenges into reliable digital products. I have experience building web applications, management systems, booking platforms, and real-time applications using modern development technologies. I enjoy learning new technologies, solving complex problems, and continuously improving my ability to build clean, efficient, and user-focused software</p>

        </div>
        <div>

        </div>
        <div className='space-y-14'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
            <div >

              <Image src="/tempo.JPG" alt="about image" height={500} width={500} />
            </div>
            <ul className='space-y-3 text-gray-300'>
              <li><h2 className='text-2xl font-semibold text-gray-200 mb-4'>my skills</h2></li>
              <li>1. Frontend (React • Next.js • HTML • CSS • JavaScript)
              </li>
              <li>2. Backend (Node.js • Express.js • Django • REST APIs)
              </li>
              <li>3. Database (PostgreSQL • MongoDB • Prisma)
              </li>
              <li>4. Tools & Technologies (
                Git • GitHub • Socket.IO • Cloudinary • Vercel)</li>
            </ul>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
            <div >

              <Image src="/award.JPG" alt="about image" height={500} width={500} />
            </div>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-200 mb-4'>CONTACT ME</h2>
              <p className='font-semibold text-gray-200 mb-4'>let`s take more</p>
              <Link href="/@temesgenML" className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-400 hover:bg-indigo-700 transition-colors text-white font-semibold'>Telegram</Link>
              <Link href="/@temesgenML" className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-400 hover:bg-indigo-700 transition-colors text-white font-semibold'>LinkedIn</Link>
            </div>
          </div>

        </div>

      </div>
    </ContainerLayout>
  )
}
