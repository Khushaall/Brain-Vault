import { ReactElement } from "react"

interface ButtonProps {
    type:"primary"| "secondary" |"danger",
    size?:"sm"|"md"|"lg",
    text:string,
    startIcon?:ReactElement,
    endIcon?:ReactElement,
    onClick?:() => void
}

const variantStyles = {
    "primary" : "bg-[#5046e4] text-white hover:shadow-lg hover:bg-[#6e66e8]",
    "secondary": "bg-[#d9ddee] text-[#3e38a7] hover:shadow-lg hover:bg-[#c6c7cf] ",
    "danger": "bg-[#ef4444] text-white hover:shadow-lg bg-[#dc2626]  "

}

const sizeStyles = {
    "sm":"py-1 px-2",
    "md":"py-1 px-4",
    "lg":"py-2 px-8"
}

const defaultstyles = "rounded-md cursor-pointer flex items-center gap-2 transition: background-color 0.3s ease "

export const Button = (props:ButtonProps )=> {

    return (
    <button 
    onClick={props.onClick} 
    className={`${variantStyles[props.type]} ${defaultstyles} ${sizeStyles[props.size]}`} 
    >
        {props.startIcon && props.startIcon}
        {props.text}
        {props.endIcon && props.endIcon}


    </button>
    );

}