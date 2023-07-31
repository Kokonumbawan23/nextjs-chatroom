import Room from "@/models/Room";

export default (io,socket) => {

    socket.on("getRoomData", async () => {
        const roomQuery = await Room.findAll();
        const roomList = roomQuery.map(({id,name, userCapacity, userConnected}) => {
            return {
                id,
                name,
                userCapacity,
                userConnected
            }
        });

        io.emit("updateRoomList", roomList)
    })

    socket.on("userJoinRoom", async (data) => {
        socket.join(data.room);
        
        await Room.update({
            userConnected: data.userConnected + 1
        },{
            where: {
                name: data.room
            },
        });

        const roomQuery = await Room.findAll();
        const roomList = roomQuery.map(({id,name, userCapacity, userConnected}) => {
            return {
                id,
                name,
                userCapacity,
                userConnected
            }
        });

        io.emit("updateRoomList", roomList);

        socket.to(data.room).emit("newIncomingMessage", {
            username: "system",
            message: `${data.username} is joining the room`
        });
    });
    socket.on("userLeaveRoom", async (data) => {
        socket.leave(data.room);

        await Room.update({
            userConnected: data.room.userConnected - 1
        },{
            where: {
                name: data.room.name
            },
        });

        const roomQuery = await Room.findAll();
            const roomList = roomQuery.map(({id,name, userCapacity, userConnected}) => {
                return {
                    id,
                    name,
                    userCapacity,
                    userConnected
                }
            });

        io.emit("updateRoomList", roomList);

        socket.to(data.room).emit("newIncomingMessage", {
            username: "system",
            message: `${data.username} is leaving the room`
        });
    });

    socket.on("userCreateRoom", async (room) => {
        const roomCreated = await Room.create({
            name: room,
        });
        if(roomCreated){
            const roomQuery = await Room.findAll();
            const roomList = roomQuery.map(({id,name, userCapacity, userConnected}) => {
                return {
                    id,
                    name,
                    userCapacity,
                    userConnected
                }
            });
        io.emit("updateRoomList", roomList)
        }
    });
}