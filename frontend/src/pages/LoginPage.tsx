import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export default function LoginPage({ setLoggedIn }) {
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    function handleNavigate(loc: string) {
        navigate(loc);
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");
        const username = UsernameRef.current?.value;
        const password = PasswordRef.current?.value;

        try {
            const res = await axios.post(
                BACKEND_URL + "/signin",
                { username, password },
                { withCredentials: true }
            );
            if (res.status === 200) {
                setLoggedIn(true);
                handleNavigate("/dashboard");
            }
        } catch (err) {
            
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || "Invalid credentials"
                : "Unexpected error";
            setErrorMessage(message);
        }
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");
        const username = UsernameRef.current?.value;
        const password = PasswordRef.current?.value;

        try {
            const res = await axios.post(BACKEND_URL + "/signup", {
                username,
                password,
            });
            if (res.status === 200) {
                setIsLogin(true);
            }
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || "Something went wrong"
                : "Unexpected error";
            setErrorMessage(message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-10 animate-pulse">
                Brain Vault
            </h1>

            <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm p-8 space-y-6">
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => {
                            setIsLogin(false);
                            setErrorMessage("");
                        }}
                        className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${isLogin
                                ? "bg-gray-100 text-gray-500"
                                : "bg-indigo-500 text-white shadow"
                            }`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => {
                            setIsLogin(true);
                            setErrorMessage("");
                        }}
                        className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${isLogin
                                ? "bg-indigo-500 text-white shadow"
                                : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        Log In
                    </button>
                </div>

                <form
                    onSubmit={isLogin ? handleLogin : handleSignup}
                    className="space-y-4"
                >
                    <div>
                        <label className="text-sm font-medium block mb-1">Username</label>
                        <input
                            ref={UsernameRef}
                            type="text"
                            placeholder="Enter username"
                            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1">Password</label>
                        <input
                            ref={PasswordRef}
                            type="password"
                            placeholder="Enter password"
                            className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center -mt-2">
                            {errorMessage}
                        </div>
                    )}

                
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {isLogin ? "Log In" : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}
