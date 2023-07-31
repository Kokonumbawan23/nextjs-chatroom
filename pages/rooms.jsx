import { useState, useEffect } from "react";
import Chat from "./chat";
import io from 'socket.io-client';

let socket;


export default function Rooms({user}) {
    
    const [rooms, setRooms] = useState([]);
    const [chosenRooms, setChosenRooms] = useState("");
    const [joinedRoom, setJoinedRoom] = useState({});
    const [roomStatus, setRoomStatus] = useState(false);
    const [userConnected, setUserConnected] = useState(0);

    useEffect(() => {
        socketInitializer();
        
    }, []);

    const socketInitializer = async () => {
        // await fetch("/api/socket")
        
        socket = io(undefined, {
            path: '/api/socket',
          });

        socket.on('updateRoomList',(roomList) => {
            setRooms(roomList);
        });

        socket.emit("getRoomData")
    }

    const createRoom = () => {
        socket.emit("userCreateRoom", chosenRooms)
    }

    const userLeaveRoom = () => {
        socket.emit("userLeaveRoom",{
            username: user,
            room: joinedRoom,
        })
    }
    
    
    return <>
        <div className="flex flex-col justify-center bg-white shadow-md rounded-md min-w-[33%] h-[40rem] p-3">
            {!roomStatus ? (<>
                <span className="p-4 text-lg text-center font-bold font-poppins">Room List</span>
            <div className="h-full overflow-y-scroll border rounded-md ">
            {
                rooms.length < 1 ? <div>No Rooms</div> : rooms.map(({id, name, userCapacity, userConnected})=>{
                    return <li key={id} className="border-b p-5 border-gray-200 flex justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold py-2">{name}</span>
                            <span className={(userConnected < userCapacity) ? "text-green-600 py-2" : "text-red-600 py-2 font-bold"}>{userConnected} / {userCapacity}</span>
                        </div>
                        <button
                        disabled={userCapacity === userConnected}
                        className={(userCapacity === userConnected ? "px-3 bg-purple-500 text-white rounded-md opacity-50" : "px-3 bg-purple-500 text-white rounded-md")}
                        onClick={()=>{
                            setJoinedRoom({
                                name,
                                userConnected
                            });
                            setRoomStatus(true);
                            }}>Join</button>
                    </li>
                })
            }
            </div>
            <span className="py-3 text-md text-center font-bold font-poppins">Or</span>
            <form className="p-3 bg-gray flex justify-center">
                <input 
                className="bg-gray-100 rounded-md me-2 p-2"
                type="text" 
                placeholder="Room Name" 
                onChange={(e) => setChosenRooms(e.target.value)}/>
                <button className="bg-purple-500 border-b rounded-md p-2 text-white" onClick={(e)=>{
                    e.preventDefault()
                    createRoom();
                }}>Create</button>
            </form>
            </>):(<>
                <Chat username={user} room={joinedRoom} socket={socket} />
            </>)}

            <button
        className={(!roomStatus ? "hidden" : "bg-red-500 py-3 rounded-md text-white my-3")}
        onClick={
            () => {
                userLeaveRoom();
                setRoomStatus(false);
            }
        }
        >Disconnect and Back to Room List</button>
        </div>
    </>
 }