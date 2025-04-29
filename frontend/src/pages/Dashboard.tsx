// src/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import Card from '../components/Card';
import ContentModal from '../components/ContentModal';
import Sidebar from '../components/Sidebar';
import PlusIcon from '../icons/PlusIcon';
import ShareIcon from '../icons/ShareIcon';
import UseContent from '../hooks/UseContent';
import SkeletonCard from '../components/SkeletonHolder';
import { SearchIcon } from '../icons/SearchIcon';
import MenuIcon from '../icons/MenuIcon';
import CrossIcon from '../icons/CrossIcon';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { TickIcon } from '../icons/TickIcon';

function Search() {
  return (

    // <div className='rounded-xl text-sm w-72 md:w-80 lg:w-96 h-10 text-gray-500 px-4 flex items-center bg-white hover:scale-105 shadow-md hover:shadow-xl transition'>
    //   {/* <div>
    //     <SearchIcon size="md" />
    //   </div>
    //   <input placeholder={`Search the Title Here....`} type="text" className='w-full h-full bg-transparent outline-none text-gray-800' /> */}
    // </div>
    <></>
  )
}

function MessagePop() {
  return (
    <div className='bg-green-100 text-black w-64 shadow-lg h-8 fixed top-24 right-8 px-4 py-6 z-50 flex items-center justify-center rounded-md '>
      <TickIcon size="lg" />
      Link Copied...
    </div>
  )
}

function Dashboard({ setLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const { contents, refresh, loading } = UseContent();
  const name = contents[0]?.userId?.username || 'User';
  const [showMessage, setShowMessage] = useState(false);
  const [hashLink, setHashLink] = useState();
  const [generating, setGenerating] = useState(false);
  const [tag, setTag] = useState('');
  const filteredContents = tag ? contents.filter(item => item.tag === tag) : contents;


  async function handleShare() {
    setGenerating(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/brain/share`, {
        share: true
      }, {
        withCredentials: true
      });

      setHashLink(res.data.hash);

      const address = "http://localhost:5173/brain/" + `${res.data.hash.toString()}`
      navigator.clipboard.writeText(address);
      setShowMessage(true);
      setGenerating(false);

    }

    catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Unknown Error";
        alert("Link Generation Failed: " + message);
      } else {
        alert("Error Generating Link");
      }
    }
  }


  useEffect(() => {

    const interval = setTimeout(() => {
      setShowMessage(false);
    }, 3000); // Hide after 3 seconds    

    return () => clearTimeout(interval); // Cleanup timer on unmount or state change
  }, [generating]);

  async function handleDelete(_id) {
    try {
      const res = await axios.delete(`${BACKEND_URL}/content/${_id}`, {
        withCredentials: true
      });

      if (res.status === 200) {
        refresh();
      }
    }
    catch (err) {
      alert("erorr Deleting");
      console.log(err);
    }
  }


  return (
    <>
      <ContentModal Open={open} onClose={() => setOpen(false)} refresh={refresh} />

      <Sidebar generating={generating} handleShare={handleShare} setSideBar={setSideBar} setTag={setTag} setLoggedIn={setLoggedIn} sideBar={sideBar} setOpen={setOpen} />

      <div className="bg-[#eeeeef] w-full min-h-screen">
        <div className="flex justify-between  gap-4 p-4 pt-8 z-30 sticky top-0 md:ml-72 bg-[#eeeeef] shadow-sm">
          <div>

            <button onClick={() => { setSideBar(true) }} className={`${sideBar ? "hidden" : ""} cursor-pointer md:hidden w-full h-8`}>
              <MenuIcon size="lg" />
            </button>

          </div>

          <div className='w-auto xl:flex xl:justify-start xl:items-start'>

            <h1 className="text-2xl font-semibold tracking-wide text-gray-700 ">
              {name}'s Dashboard
            </h1>
          </div>

          <div className="flex gap-4">
            <div>
              <Search />
            </div>
            <div className='xl:flex gap-4 hidden '>

              <Button
                type="secondary"
                onClick={handleShare}
                size="lg"
                text={`${generating ? "Generating Link ...." : "Share Link"}`}
                startIcon={generating ? undefined : <ShareIcon size="md" />}


              />
              <Button
                type="primary"
                onClick={() => setOpen(true)}
                size="lg"
                startIcon={<PlusIcon size="md" />}
                text="Add Content"
              />
            </div>

          </div>



        </div>

        <div className="flex justify-center gap-2 p-2 md:ml-72 ml-4 flex-wrap">
          {showMessage && <MessagePop />}


          {loading ? (
            Array(6)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          ) : filteredContents.length > 0 ? (
            filteredContents.map(({ title, tag, link, _id }) => (
              <Card key={_id} type={tag} link={link} title={title} onDelete={() => handleDelete(_id)} />

            ))
          ) : (

            <div className='text-gray-500 flex justify-center mt-8 items-center text-2xl'>
              No content found for {tag || 'All'}
            </div>

          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;