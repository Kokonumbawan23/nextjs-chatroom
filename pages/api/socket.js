import {Server} from 'socket.io';
import messageHandler from "@/utils/sockets/messageHandler"; 
import roomHandler from '@/utils/sockets/roomHandler';

export default function socketHandler(req, res) {
    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
      }
    
      const io = new Server(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
        });

      res.socket.server.io = io;
    
      const onConnection = (socket) => {
        messageHandler(io, socket);
        roomHandler(io,socket);

        
      };
    
      // Define actions inside
      io.on("connection", onConnection);
    
      console.log("Setting up socket");
      res.end();
  }