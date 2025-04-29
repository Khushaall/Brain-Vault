import { ReactElement } from "react"

interface ItemProps{
    text:string,
    startIcon:ReactElement
    onClick?:()=>void
    active:boolean
    
}
export default function SidebarItems({text,startIcon,onClick,active}:ItemProps){

    return (
        <button onClick={onClick} className={`w-full flex cursor-pointer text-black text-md items-center hover:bg-gray-200 transition-all rounded-md p-2 ${active ? "bg-gray-200" :""}`}>
            {startIcon}
            {text}
        </button>

    )
}