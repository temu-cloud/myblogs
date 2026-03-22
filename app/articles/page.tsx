"use client"
import Link from 'next/link'
 
import { LuArrowRight } from 'react-icons/lu'
 
import Image from 'next/image'
import ContainerLayout from '../layouts/ContainerLayout'
 
import { useInfinitePosts } from '../custom-hooks/usePost'
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton'

export default function ArticlesPage() {
  
  const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useInfinitePosts({limit:3});
  if(status==="pending"){
    return(
      <ContainerLayout>
        <PostCardSkeleton />
      </ContainerLayout>
    )
  }
  if(status==="error"){
    <ContainerLayout>
      <p>unable to load</p>
    </ContainerLayout>
  }
  const posts= data?.pages.flatMap((page)=>page.posts)?? [];
  return (
    <ContainerLayout>
    <div className='space-y-6 '>
        <h2 className='text-xl sm:text-2xl text-white font-semibold'>All articles</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
         {posts.map((post)=>{return(
            <div key={post.id} className="group relative rounded-xl overflow-hidden bg-background/50 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 ">
                
                <div className="relative h-48 w-full overflow-hidden">
               {post.coverImageUrl && (
                 <div className="relative h-48 w-full overflow-hidden">
                  <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
               )}
                 
                </div>
                <div className="p-5 space-y-3">
                  <time  className="text-xs text-gray-400 "> 
                    {
                      new Date(post.createdAt).toLocaleDateString("en-GB",{
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                      })
                    }
                  </time>
                  <h3 className="text-lg font-semibold text-black leading-snug group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <Link href={`articles/${post.slug}`} className= " flex  text-sm font-medium text-indigo-400 hover:underline" >
                  Read more <LuArrowRight size={20} />
                  </Link>
                  
                </div>
               {/*<div className="absolute inset-0 bg-black/30"/>*/} 
            </div>
         )})}
        </div>
    </div>
   
   {
    hasNextPage &&(
       <div className='flex justify-center mt-10 '>
         <button onClick={()=>fetchNextPage()} disabled={isFetchingNextPage} className='px-8 py-3 rounded-2xl bg-green-800 text-white text-sm font-medium border border-white/10 hover:text-green-800 hover:bg-white transition-all duration-300 cursor-pointer'> {isFetchingNextPage?"loading":"load more"}</button>
    </div>
    )
   }
    </ContainerLayout>
  )
}
