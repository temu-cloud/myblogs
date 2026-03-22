 
import { LuArrowRight } from "react-icons/lu";
import ContainerLayout from "./layouts/ContainerLayout";
import Image from "next/image";
import Link from "next/link";
import RecentPosts from "./components/home/RecentPosts";
import { Suspense } from "react";
import PostCardSkeleton from "./components/skeletons/PostCardSkeleton";
export default function Home() {
  return (
    <ContainerLayout>
      <h1 className="text-3xl lg:text-5xl xl:text-7xl text-center text-white tracking-wide leading-snug lg:leading-tight ">
        <span className="font-bold">well come to myblog website   </span><br />
        Discover Stories and Creative Ideas!
        </h1>
      
      <div className="py-12 lg:py-2 mb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ">
            <div className="relative">
              <Image src="/hero.png" alt="about" width={600} height={600}
              className="rounded-2xl border border-white/10"
              />
            </div>
            <div className="max-w-xl">
               <span className="text-sm uppercase tracking-widest text-indigo-400">
                about myblogs
               </span>
               <h3 className="mt-3 text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-secondary-background">
                simple ways to Innovate your Inner Creative Mind

               </h3>
               <p className="mt-6 text-gray-400 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, velit repellat numquam facilis est aut porro voluptate nostrum mollitia id, natus ut a ab deserunt omnis voluptatum minima temporibus quis.
               </p>
               <div className="mt-2"  >
                <Link href="/about" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-amber-50 font-semibold hover:bg-amber-50 hover:text-primary transition-colors">
                Learn More
                <LuArrowRight size={15}/>
                </Link>
               </div>
            </div>
        </div>

      </div>
      <Suspense fallback={<PostCardSkeleton/>}>
        <RecentPosts/>
      </Suspense>
    </ContainerLayout>
  );
}
