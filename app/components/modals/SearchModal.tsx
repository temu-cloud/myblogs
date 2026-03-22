
"use client"
import { useModalStore } from '@/app/store/useModalStore'
import React, { useState } from 'react'
import Modal from './Modal';
import { useDebounce } from '@/app/custom-hooks/usePost';
import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '@/app/services/post';
import { Post } from '@/app/types/post';
import { useRouter } from 'next/navigation';

 
export default function SearchModal() {
    const {isSearchOpen,closeSearch}=useModalStore();
    const [query,setQuery]=useState("")
    const debouncedQuery=useDebounce(query,400)
      const router = useRouter();
    const{data:results=[],isLoading,isFetching}=useQuery({
      queryKey:["search-posts",debouncedQuery],
      queryFn:()=>searchPosts(debouncedQuery),
      enabled:debouncedQuery.length>1,
    })
    
  const handleNavigate = (slug: string) => {
    router.push(`/articles/${slug}`);
    closeSearch();
    setQuery("");
  };
  return (
     <Modal isOpen={isSearchOpen} onClose={closeSearch}>
       <div className='space-y-4'>
         <input value={query} onChange={(e)=>setQuery(e.target.value)} type="search" placeholder='search articles' autoFocus className='w-full border border-background p-2 rounded-2xl'  />
          <div className='max-h-80 overflow-y-auto rounded-2xl border border-background divide-y '>
                      {(isLoading || isFetching) && (
            <div className="px-4 py-3 text-gray-400 text-sm">Searching...</div>
          )}

          {/* empty */}
          {!isLoading && debouncedQuery && results.length === 0 && (
            <div className="px-4 py-3 text-gray-400 text-sm">
              No results found!
            </div>
          )}
               {
                results.map((result:Post)=>{
                    return(
                        <button 
                         onClick={() => handleNavigate(result.slug)}
                        key={result.id} className='w-full text-left px-4 py-3 text-gray-700   '>
                            {result.title}
                         
                        </button>
                    )
                })
               }
          </div>
       </div>
     </Modal>
  )
}
