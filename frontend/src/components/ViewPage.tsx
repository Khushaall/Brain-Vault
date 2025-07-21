import { useEffect, useState } from "react";
import SkeletonCard from "./SkeletonHolder";
import UseShow from "../hooks/UseShow";
import UseContent from "../hooks/UseContent";
import Card from "./Card";
import { Button } from "./Button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

type ContentItem = {
  title: string;
  tag: string;
  link: string;
};

export default function ViewPage() {

  const [content, setContent] = useState<ContentItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { link } = useParams();


  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/brain/${link}`, {
          withCredentials: true
        });

        setContent(res.data.content);
        setUsername(res.data.username);

        setLoading(false);

      } catch (err) {
        alert("No such Page");
      }
    }

    fetchData();
  }, []);

  function handleSubmit() {
    navigate("/")
  }


  const filteredContents = content;
  return (
    <div className="bg-[#eeeeef] w-screen min-h-screen">
      <div className="flex p-8 pl-12 pr-12 justify-between">
        <div> <h1 className="lg:text-2xl md:text-xl  sm:text-md text-2xl font-semibold tracking-wide text-gray-700   text-center " >
          {username}'s Dashboard
        </h1></div>
        <div>
          <Button type="primary" onClick={handleSubmit} size="lg" text="Log in to WebSite" />
        </div>
      </div>

      <div className="flex justify-center gap-2 p-2  ml-4 flex-wrap">


        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : filteredContents?.length > 0 ? (
          filteredContents?.map(({ title, tag, link }) => (
            <Card key={link} type={tag as "youtube" | "tweet" | "document"} link={link} title={title} />
          ))
        ) : (

          <div className='text-gray-500 flex justify-center mt-8 items-center text-2xl'>
            No links Stored for Now...
          </div>

        )}
      </div>
    </div>
  )
}