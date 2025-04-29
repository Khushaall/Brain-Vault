// import { ReactElement } from "react"

import { useState } from "react";
import BrainIcon from "../icons/BrainIcon";
import DocIcon from "../icons/DocIcon";
import HashIcon from "../icons/HashIcon";
import { HomeIcon } from "../icons/HomeIcon";
import LinkIcon from "../icons/LinkIcon";
import TweetIcon from "../icons/TweetIcon";
import VideoIcon from "../icons/VideoIcon";
import SidebarItems from "./SidebarItems";
import { Button } from "./Button";
import MenuIcon from "../icons/MenuIcon";
import ShareIcon from "../icons/ShareIcon";
import PlusIcon from "../icons/PlusIcon";
import CrossIcon from "../icons/CrossIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

// interface SidebarProps {
//     title: string,
//     items: ReactElement,
//     startIcon: ReactElement
// }




export default function Sidebar({generating,handleShare, setTag, sideBar, setOpen, setSideBar, setLoggedIn }) {

    async function Logout() {
        try {
            const res = await axios.post(`${BACKEND_URL}/logout`, {}, {
                withCredentials: true
            });
            console.log(res.status);
            if (res.status === 200) {

                setLoggedIn(false);
            }
        }
        catch (err) {
            alert("Error Try Again");
            console.log(err);
        }

    }

    const [selected, setSelected] = useState("Home");

    return (<>



        <div className={`min-h-screen lg:block ${sideBar ? "" : "hidden"} md:block fixed top-0 left-0 bg-white z-35 p-4 w-72 shadow-inner `}>

            <div className="flex justify-between" >

                <div className={`flex gap-2 `}>
                    <BrainIcon width={40} height={40} fill="#7164c0" />
                    <span className="text-2xl">
                        Brain Vault
                    </span>
                </div>
                <div>
                    <button onClick={() => { setSideBar(false) }} className={`${sideBar ? "" : "hidden"} md:hidden cursor-pointer w-full h-8`}>
                        <CrossIcon size="lg" />
                    </button>
                </div>

            </div>

            <div className="flex flex-col gap-4 mt-4 ">
                <SidebarItems active={selected === "Home"} startIcon={<HomeIcon size="lg" />} text="Home" onClick={() => { setTag(""); setSelected("Home"); setSideBar(false) }} />
                <SidebarItems active={selected === "Tweets"} startIcon={<TweetIcon size="lg" />} text="Tweets" onClick={() => { setTag("tweet"); setSelected("Tweets"); setSideBar(false) }} />
                <SidebarItems active={selected === "Videos"} startIcon={<VideoIcon size="lg" />} text="Videos" onClick={() => { setTag("youtube"); setSelected("Videos"); setSideBar(false) }} />
                <SidebarItems active={selected === "Douments"} startIcon={<DocIcon size="lg" />} text="Documents" onClick={() => { setTag("document"); setSelected("Documents"); setSideBar(false) }} />
                <SidebarItems active={selected === "Links"} startIcon={<LinkIcon size="lg" />} text="Links" onClick={() => { setTag("link"); setSelected("Links"); setSideBar(false) }} />
                {/* <SidebarItems active={selected === "Tags"} onClick={() => { setTag("link"); setSelected("Tags"); setSideBar(false) }} startIcon={<HashIcon size="lg" />} text="Tags" /> */}

                <div className={`flex flex-col gap-4 mr-8 mb-8 xl:hidden`}>
                    <Button
                        type="secondary"
                        onClick={()=>{
                            handleShare();
                            setSideBar(false);
                        }}
                        size="lg"
                        text={`${generating ? "Generating Link ...." : "Share Link"}`}
                        startIcon={generating ? undefined : <ShareIcon size="md" />}


                    />
                    <Button
                        type="primary"
                        onClick={() => { setOpen(true); setSideBar(false) }}
                        size="lg"
                        startIcon={<PlusIcon size="md" />}
                        text="Add Content"
                    />

                </div>


            </div>

            <div className="fixed bottom-0 left-0 m-4 ">
                <Button type="danger" onClick={Logout} text="Log Out" size="lg" />
            </div>

        </div>


    </>
    )
}