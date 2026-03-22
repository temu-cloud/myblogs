 import Link from "next/link"

export default function Logo() {
  return (
      <Link href="/" className="text-amber-50 font-bold text-xl md:text-2xl lg:text-3xl">
           My <span className="text-primary">blog</span>
           </Link> 
  )
}
