import React from 'react'
import { LuX } from 'react-icons/lu'
interface ModalProps{
    isOpen:boolean,
    onClose:()=>void,
    children:React.ReactNode
}
export default function Modal({isOpen,onClose,children}:ModalProps) {
  return (
    <div aria-hidden={!isOpen}
     className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-700 ${isOpen? "opacity-100 ":"opacity-0 pointer-events-none"}`}
     >
     <div onClick={onClose} className={`absolute inset-0 bg-black/50 transition-all duration-700 ${isOpen?"opacity-100":"opacity-0"}`}/>
     <div className={`relative top-0 z-10 w-full max-w-md rounded-2xl bg-white border border-white/10 px-6 py-12 shadow-xl transform transition-all duration-700 ${isOpen?"translate-y-0":"translate-y-full "} ${isOpen?"opacity-100":"opacity-0"}`}>
       <button className='absolute right-4 top-4 cursor-pointer text-background hover:text-white transition' aria-label='Close Model ' onClick={onClose}>
          <LuX/>
       </button>
       {children}
     </div>
    </div>
  )
}
