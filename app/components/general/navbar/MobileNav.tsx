import React from 'react'
import { navlinks } from './Navbar'
import Link from 'next/link'


interface MobileNavProps{
    setMenuOpen:React.Dispatch<React.SetStateAction<boolean>>,
    menuOpen:boolean
}
export default function MobileNav({setMenuOpen,menuOpen}:MobileNavProps) {
  return (
    <div className='md:hidden' >
       <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen? "opacity-100 ":"opacity-0 pointer-events-none"}`}/>
       <ul className={`fixed top-18 right-0 z-50 h-[80vh] w-full flex flex-col gap-10 items-center justify-center bg-black/60 backdrop-blur-xl border-t border-white/10 transition-transform duration-100 ease-in-out ${menuOpen?"translate-x-0":"translate-x-full"}`}>
      {
        navlinks.map((link)=>{
            return(
                <li key={link.url} className='text-xl font-semibold tracking-wide text-amber-50 hover:text-indigo-400 transition-colors '>
                  <Link onClick={()=>setMenuOpen(false)} href={link.url}>{link.label }</Link>
                </li>
            )
        })
      }
       </ul>
    </div >
  )
}
