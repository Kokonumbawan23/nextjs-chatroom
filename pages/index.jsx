import Layout from "@/components/layout";
import Chat from "./chat";
import { useState, useEffect } from "react";
import Rooms from "./rooms";

export default function Home() {
    const [username, setUsername] = useState("");
    const [chosenUsername, setChosenUsername] = useState("");

    return (
        <Layout>
            <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
              {!chosenUsername ? (
                <>
                <h3 className="font-bold text-white text-xl">
                  How people should call you?
                </h3>
                <input
                  type="text"
                  placeholder="Identity..."
                  value={username}
                  className="p-3 rounded-md outline-none"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  onClick={() => {
                    setChosenUsername(username);
                  }}
                  className="bg-white rounded-md px-4 py-2 text-xl"
                >
                  Go!
                </button>
              </>) : (<Rooms user={chosenUsername}/>)}
              
          </main>
        </Layout> 
      );
  }

  