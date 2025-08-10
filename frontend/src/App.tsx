import Dashboard from "./pages/Dashboard"
import './App.css'
import { BrowserRouter , Routes , Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "./config"
import ViewPage from "./pages/ViewPage"



function App() {

  const[LoggedIn , setLoggedIn]=useState(false);
  const [loading, setLoading] = useState(true); 

  async function Verify(){
    try
    {const res = await axios.get(`${BACKEND_URL}/verify`,{
      withCredentials:true
    });
  
if (res.status === 200) {
    console.log(res.status);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }  }
      catch (err) {
        console.log(err);
        setLoggedIn(false);
      } finally {
        setLoading(false); 
      }
    }

  useEffect(()=>{
    Verify();
  },[])

  if (loading) {
    return <div className="flex justify-center items-center h-screen w-scren bg-gray-100">Loading...</div>; 
  }

  return (
    <BrowserRouter>
    <Routes>
  <Route
    path="/dashboard"
    element={LoggedIn ? <Dashboard setLoggedIn={setLoggedIn}/> : <Navigate to="/" />}
  />
  <Route
    path="/"
    element={<LoginPage setLoggedIn={setLoggedIn} />}
  />
   <Route
    path="/brain/:link"
    element={<ViewPage/>}
  />
</Routes>
    </BrowserRouter>
  )
}

export default App
