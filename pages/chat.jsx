import io from 'socket.io-client';
import { useState, useEffect } from 'react';


export default function Chat({username, room, socket}) { 
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userTyping, setUserTyping] = useState([]);
    const [typingStatus, setTypingStatus] = useState(false); 
    
    let timeout ;
   

    useEffect(() => {
      socketInitializer();
    }, []);
  
    const socketInitializer = async () => {

      socket.emit("userJoinRoom", {username, room: room.name, userConnected: room.userConnected});

      socket.on("newIncomingMessage", (msg) => {
        setMessages((currentMsg) => [
          ...currentMsg,
          { username: msg.username, message: msg.message },
        ]);
      });

      socket.on("userChangeTypingStatus", (user) => {
        setUserTyping((prevState) => [...new Set([...prevState, user])]);

      });

      socket.on("userChangeNotTypingStatus", (user) => {
        setUserTyping((prevState) => prevState.filter((e)=> e != user));
      });
      };

    const sendMessage = async () => {
        socket.emit("sendRoomMessage", { username, room: room.name, message });
        setMessages((currentMsg) => [
          ...currentMsg,
          { username, message },
        ]);
        setMessage("");
      };

    const handleUserNotTyping = () => {
      setTypingStatus(false);
      socket.emit("userNotTyping", username)
    }

    const handleInputMessage = (e) => 
    { 
      if(typingStatus == false){
        setTypingStatus(true);
        socket.emit("userTyping", username);
        timeout = setTimeout(handleUserNotTyping, 1500);
      }
      else {
        clearTimeout(timeout);
        timeout = setTimeout(handleUserNotTyping, 1500);
      }

      setMessage(e.target.value);
    }
    
      const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
          if (message) {
            sendMessage();
          }
        }
      };

      
    return <>
    <p className="font-bold text-black text-xl text-center py-5">
      Current Room: {room.name}
    </p>
    {userTyping.length !== 0 ? <span className='font-semibold'>{`${userTyping.toString()} is typing`}</span>
     : <span>StandBy...</span>}
    <div className="flex flex-col justify-end bg-white h-[35rem] min-w-[33%] rounded-md shadow-md border ">
      <div className="h-full last:border-b-0 overflow-y-scroll max-h-[28rem]">
        {messages.map((data, i) => {
          return (
            <div
              className={(data.username !== username)? ((data.username === "system") ? "text-center w-full py-1 px-2 border-b border-gray-200 bg-yellow-200": "text-right w-full py-1 px-2 border-b border-gray-200") : "w-full py-1 px-2 border-b border-gray-200"}
              key={i}
            >
              <span className='font-semibold'>{data.username}</span> : {data.message}
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-300 w-full flex rounded-bl-md">
        <input
          type="text"
          placeholder="New message..."
          value={message}
          className="outline-none py-2 px-2 rounded-bl-md flex-1"
          onChange={handleInputMessage}
          onKeyUp={handleKeypress}
        />
        <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
          <button
            className="group-hover:text-white px-3 h-full"
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </>
 }