import { create } from "zustand"



interface ModalState{
    isSignInOpen:boolean,
    isSearchOpen:boolean,
    openSignIn:()=>void,
    openSearch:()=>void,
    closeSignIn:()=>void,
    closeSearch:()=>void,
    closeAll:()=>void
}
export const useModalStore=create<ModalState>((set)=>({
    isSignInOpen:false,
    isSearchOpen:false,
    openSearch:()=>set({isSearchOpen:true,isSignInOpen:false}),
    openSignIn:()=>set({isSignInOpen:true,isSearchOpen:false}),
    closeSearch:()=>set({isSearchOpen:false}),
    closeSignIn:()=>set({isSignInOpen:false}),
    closeAll:()=>set({isSearchOpen:false,isSignInOpen:false})

}))