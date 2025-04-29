import { useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";


export default function LoginPage({setLoggedIn} ) {

    const [islog, setislog] = useState(true);
    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);


    const navigate = useNavigate()

    function handleNavigate(loc) {
        navigate(loc)

    }

    async function handleLogin(e) {
        e.preventDefault();
        const username = UsernameRef.current?.value;
        const password = PasswordRef.current?.value;

        try {


            const res = await axios.post(BACKEND_URL + "/signin", {
                username,
                password
            }, {
                withCredentials: true
            });
            if (res.status === 200) {
                handleNavigate("/dashboard");
                setLoggedIn(true);
                
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || "Unknown Error";
                alert("Signup Failed: " + message);
            } else {
                alert("Signup Failed: Unexpected Error");
            }
        }


    }
    async function handleSignup(e) {
        e.preventDefault();

        const username = UsernameRef.current?.value;
        const password = PasswordRef.current?.value;


        try {
            const res = await axios.post(BACKEND_URL + "/signup", {
                username,
                password
            });

            if (res.status === 200) {
                setislog(true);
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || "Unknown Error";
                alert("Signup Failed: " + message);
            } else {
                alert("Signup Failed: Unexpected Error");
            }
        }


    }

    return (
        <>
            <div className="text-4xl font-bold text-center mt-10 text-indigo-600 animate-pulse">
                Welcome to Brainly !!
            </div>

            <div>
                <div className="fixed inset-0 z-40 flex justify-center">
                    <div className="absolute inset-0 bg-black opacity-50"></div>

                    <div className="flex justify-center h-screen z-100 items-center ">


                        <div className=" px-12 rounded-2xl sm:w-[400px] h-auto w-auto   bg-white shadow-lg p-6 ">
                            {/* <div> <button onClick={onClose} className="cursor-pointer" ><FaArrowLeft size={16} /></button> </div> */}
                            <div className="flex justify-center mb-5 gap-6">
                                <button onClick={() => setislog(false)} className={`cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-lg ${islog ? "" : "bg-indigo-400 px-2 py-1 rounded-lg"}`}>Sign Up</button>
                                <button onClick={() => setislog(true)} className={`cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-lg ${islog ? "bg-indigo-400 px-2 py-1 rounded-lg" : ""}`}>Log In</button>
                            </div>

                            <div>
                                <form className=" flex flex-col gap-3">

                                    <div className={`${islog ? "block" : "block"}`}>
                                        <label className="block">Username</label>
                                        <input ref={UsernameRef} className="bg-gray-100 w-full rounded-lg px-3 py-2" type="text" placeholder="Username" />
                                    </div>

                                    {/* <div>
                                        <label className="block">Email</label>
                                        <input className="bg-gray-100 w-full rounded-lg px-3 py-2" value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" id="email" placeholder="Email" />
                                    </div> */}
                                    <div>
                                        <label className="block">Password</label>
                                        <input className="bg-gray-100 w-full rounded-lg px-3 py-2" ref={PasswordRef} type="text" id="password" placeholder="Password" />
                                    </div>


                                </form>

                            </div>

                            <div className={` ${islog ? "hidden" : ""} flex justify-center mt-4 m-3 `}>
                                <button onClick={handleSignup} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white px-24 py-2 rounded-xl ">Signup</button>
                            </div>
                            <div className={` ${islog ? "" : "hidden"} flex justify-center mt-4 m-3 `}>
                                <button onClick={handleLogin} className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white px-24 py-2 rounded-xl ">Log In</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}