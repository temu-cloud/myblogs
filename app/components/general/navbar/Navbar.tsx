"use client";
import Link from "next/link"
import Logo from "./Logo"
import { LuMenu, LuNotebookPen, LuSearch, LuX } from "react-icons/lu"
import MobileNav from "./MobileNav"
import { useState } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { authClient } from "@/app/lib/auth-client";


export const navlinks = [
    { url: "/", label: "Home" },
    { url: "/articles", label: "Articles" },
    { url: "/about", label: "About" },
]


export default function Navbar() {
    const { openSignIn, openSearch } = useModalStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const handleLogout=async()=>{
        await authClient.signOut();
    }

    return (
        <nav className="h-18    fixed top-0  left-0   z-50 backdrop-blur-md backdrop-saturate-50 w-full">
            <div className="flex items-center justify-between h-full w-[90%] mx-auto">
                <Logo />
                <ul className="flex items-center gap-4 md:gap-8 text-amber-50 font-semibold">
                    <li onClick={openSearch} className="flex items-center cursor-pointer gap-1 hover:text-indigo-400">
                        <LuSearch size={25} /> <span className="hidden md:block">search</span>
                    </li>
                    {
                        session && (
                            <Link href="/write" className="flex items-center cursor-pointer gap-1 hover:text-indigo-400">
                                <li className="flex gap-1.5">
                                    <LuNotebookPen size={20} /> <span className="hidden md:block">write</span>
                                </li>
                            </Link>
                        )
                    }

                    {
                        navlinks.map((link) => {
                            return (
                                <li key={link.url} className="hidden md:block hover:text-indigo-400">
                                    <Link href={link.url}>{link.label}</Link>
                                </li>
                            )
                        })
                    }
                    

                    <>
                    {!isPending &&(
                        <>
                        { 
                            session ?(
                                <li onClick={handleLogout} className="bg-primary text-amber-50 px-3 lg:px-5 py-2 rounded-full cursor-pointer hover:text-indigo-400 hover:bg-amber-50">Logout</li>
                            ):(
                                <li onClick={openSignIn} className="bg-primary text-amber-50 px-3 lg:px-5 py-2 rounded-full cursor-pointer hover:text-indigo-400 hover:bg-amber-50">Login</li>
                            )
                        }
                        </>
                    )}
                    </>
                    <li className="cursor-pointer md:hidden z-80" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
                    </li>
                </ul>
            </div>
            <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />



        </nav>
    )
}

