import { useRef } from "react"
import CrossIcon from "../icons/CrossIcon"
import { Button } from "./Button"
import axios from "axios"
import { BACKEND_URL } from "../config"


interface ModalProps {
    Open: boolean,
    refresh:()=> void,
    onClose: () => void
}
interface InputProps {
    placeholder: string,
    ref?: any
}
function Input({ placeholder, ref }: InputProps) {


    return (
        <input ref={ref} placeholder={placeholder} className="px-4 py-2 border-gray-200 rounded border-2 focus-outline-none" />
    )
}

export default function ContentModal({ onClose, Open, refresh }: ModalProps) {
    const TagRef = useRef<HTMLInputElement>();
    const TitelRef = useRef<HTMLInputElement>();
    const LinkRef = useRef<HTMLInputElement>();



    async function handleSubmit() {
        const tag = TagRef.current?.value;
        const title = TitelRef.current?.value;
        const link = LinkRef.current?.value;

        try {
            const res = await axios.post(BACKEND_URL + "/content", {
                title,
                link,
                tag
            }, {
                withCredentials: true
            });

            if (res.status === 200) {
                refresh();
                onClose();
                

                
            }
            else if (res.status === 400) {
                alert("All Fields Required");
            }
            else if (res.status === 503) {
                alert("Server Error");
            }

        }
        catch (err) {
            alert("Error Creating ");
            console.log(err);
        }


    }

    return (<>
        {Open && <div className="fixed inset-0 z-40 flex justify-center items-center xl:justify-end xl:items-start xl:pt-16 xl:pr-52">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-50 rounded-md bg-white h-72 shadow-md p-4 flex justify-center flex-col gap-4 w-96 ">
                <div className="flex justify-between">
                    <span className="flex justify-center text-xl">Create Content</span>
                    <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-black"><CrossIcon size="lg" /></button>

                </div>
                <Input ref={TitelRef} placeholder="Title" />
                <Input ref={LinkRef} placeholder="Link" />
                <select name="Tag" ref={TagRef} className="border-gray-300 border-2 rounded p-2 ">
                    <option value="youtube">Youtube</option>
                    <option value="tweet">Twitter</option>
                    <option value="document">Git Hub</option>
                </select>
                <div className="flex justify-center">

                    <Button text="Submit" onClick={handleSubmit} size="lg" type="primary" />
                </div>
            </div>

        </div>}
    </>
    )
}