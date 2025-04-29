import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export default function UseShow(link){


    const [contents,setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    function refresh(){
    try{
        axios.get(`${BACKEND_URL}/${link}` ,{
         withCredentials:true
        })
         .then((res)=>{
             setContents(res.data.content)
             setLoading(false);
         })
     }
     catch(err){
         alert("Error Getting Messages");
         console.log(err);
     }
    }

    useEffect(()=>{
        refresh();
    },[])

    return {contents,refresh,loading};
}