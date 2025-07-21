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
import MenuIcon from '../icons/MenuIcon';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { TickIcon } from '../icons/TickIcon';

function Dashboard({ setLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tag, setTag] = useState('');
  const [hashLink, setHashLink] = useState();
  const { contents, refresh, loading } = UseContent();
  const name = contents[0]?.userId?.username || 'User';

  const filteredContents = tag ? contents.filter(item => item.tag === tag) : contents;

  async function handleShare() {
    setGenerating(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/brain/share`, {
        share: true
      }, { withCredentials: true });

      setHashLink(res.data.hash);
      const address = `${window.location.origin}/brain/${res.data.hash}`;
      navigator.clipboard.writeText(address);
      setShowMessage(true);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Error Generating Link";
      alert(`Link Generation Failed: ${message}`);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(_id: string) {
    try {
      const res = await axios.delete(`${BACKEND_URL}/content/${_id}`, {
        withCredentials: true
      });
      if (res.status === 200) refresh();
    } catch (err) {
      alert("Error deleting content.");
    }
  }

  useEffect(() => {
    if (!showMessage) return;
    const timeout = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timeout);
  }, [showMessage]);

  return (
    <>
      <ContentModal Open={open} onClose={() => setOpen(false)} refresh={refresh} />

      <Sidebar
        generating={generating}
        handleShare={handleShare}
        setSideBar={setSideBar}
        setTag={setTag}
        setLoggedIn={setLoggedIn}
        sideBar={sideBar}
        setOpen={setOpen}
      />

      <div className="bg-[#f5f6f8] w-full min-h-screen">
        <div className="flex justify-between gap-4 p-4 pt-8 sticky top-0 md:ml-72 bg-[#f5f6f8] shadow-sm z-30">
          <button onClick={() => setSideBar(true)} className={`${sideBar ? "hidden" : ""} md:hidden`}>
            <MenuIcon size="lg" />
          </button>

          <h1 className="text-2xl font-semibold tracking-wide text-gray-700">
            {name}'s Dashboard
          </h1>

          <div className="hidden xl:flex gap-4">
            <Button
              type="secondary"
              onClick={handleShare}
              size="lg"
              text={generating ? "Generating Link..." : "Share Link"}
              startIcon={!generating && <ShareIcon size="md" />}
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

        <div className="p-4 md:ml-72">
          {showMessage && (
            <div className="bg-green-100 text-black fixed right-8 top-24 w-fit px-4 py-2 mb-4 shadow-md rounded-md flex items-center gap-2 animate-fade-in">
              <TickIcon size="lg" />
              <span className="text-sm">Link copied to clipboard</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-wrap justify-center gap-4">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredContents.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-start">
              {filteredContents.map(({ title, tag, link, _id }) => (
                <Card key={_id} type={tag} link={link} title={title} onDelete={() => handleDelete(_id)} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500 mt-16 flex justify-center text-xl md:text-2xl">
              Your vault is empty — Start adding links to power your second brain.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
