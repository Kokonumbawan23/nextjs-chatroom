export default (io, socket) => {

    socket.on("sendRoomMessage", (data) => {
      socket.to(data.room).emit("newIncomingMessage", {
        username: data.username,
        message: data.message
      });
  });
  
    socket.on("createdMessage", (msg) => {
      socket.broadcast.emit("newIncomingMessage", msg)
    });

    socket.on("userTyping", (user) => {
      socket.broadcast.emit("userChangeTypingStatus", user)
    });

    socket.on("userNotTyping", (user)=>{
      socket.broadcast.emit("userChangeNotTypingStatus", user);
    })  
  };