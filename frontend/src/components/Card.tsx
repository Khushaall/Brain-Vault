import { useEffect, useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import ShareIcon from "../icons/ShareIcon";
import TweetIcon from "../icons/TweetIcon";
import VideoIcon from "../icons/VideoIcon";
import DocIcon from "../icons/DocIcon";
import UseContent from "../hooks/UseContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CardProps {
    title?: string;
    link?: string;
    type?: "youtube" | "tweet" | "document";
    onDelete?: () => void
}

export default function Card(props: CardProps) {
    const [docContent, setDocContent] = useState("");
 


    useEffect(() => {
        if (props.type === "document") {
            const rawUrl = props.link
                .replace("github.com", "raw.githubusercontent.com")
                .replace("/blob/", "/");

            fetch(rawUrl)
                .then((res) => res.text())
                .then((data) => setDocContent(data))
                .catch((err) => setDocContent("Error loading document"));
        }
    }, [props.link, props.type]);

    return (
        <div className="max-h-80 h-full lg:w-80 w-96 bg-white rounded-xl shadow-md overflow-y-scroll no-scrollbar transition-all duration-300 hover:scale-105 hover:shadow-2xl p-4 m-4">
            <div className="flex justify-between">
                <div className="flex items-center text-gray-500">
                    {props.type === "youtube" && <VideoIcon size="lg" />}
                    {props.type === "tweet" && <TweetIcon size="lg" />}
                    {props.type === "document" && <DocIcon size="lg" />}
                    <span className="text-black text-md">{props.title}</span>
                </div>
                <div className="flex gap-2 items-center text-gray-500">
                    <a href={props.link} target="_blank" className="hover:text-black">
                        <ShareIcon size="md" />
                    </a>
                    <button className="hover:text-black cursor-pointer" onClick={props.onDelete}>
                        <DeleteIcon />

                    </button>
                </div>
            </div>

            <div className="pt-4">
                {props.type === "youtube" && (
                    <iframe
                        className="w-full"
                        src={props.link.replace("watch?v=", "embed/")}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                )}

                {props.type === "tweet" && (
                    <blockquote className="twitter-tweet">
                        <a href={props.link.replace("x.com", "twitter.com")}></a>
                    </blockquote>
                )}

                {props.type === "document" && (
                    <pre className="text-sm bg-gray-100 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                        {docContent || "Loading..."}
                    </pre>
                )}
            </div>
        </div>
    );
}
