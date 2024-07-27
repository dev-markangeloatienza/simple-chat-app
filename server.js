import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT"]
    },
    pingTimeout: 10000,
    pingInterval: 25000,
    maxHttpBufferSize: 1024 * 1024 * 10, // 10MB
}
const io = new Server(httpServer, options)

io.on('connection', (socket) => {
    console.log("Connection established on %s", socket.id)
    console.log(`Running socket rooms: `, socket.rooms)

    socket.on('room:join',(roomId)=>{
        console.log(`Joining room: ${roomId}`)
        socket.join(roomId)
        console.log(`ROOMS:` , io.sockets.adapter.rooms)
        io.sockets.in(roomId).emit('room:connected',`Connected to room ${roomId}`)
    })

    socket.on("message:send",(msg)=>{
        console.log(msg.toString())
    })
    
    socket.on("room:message",({roomId,message})=>{
        console.log(`Message from room ${roomId}:`, message)

        io.in(roomId).emit('room:message',{
            message,
            sender: socket.id
        })
        // socket.broadcast.to(roomId).emit('room:message',{
        //     message,
        //     sender: socket.id
        // })
    })

    socket.on("disconnecting", () => {
        console.log("Disconnection from room: ",socket.rooms); // the Set contains at least the socket ID
      });

    socket.on('disconnect', (reason) =>{
        console.log('Client disconnected from %s', socket.id)
        console.log('Reason: ', reason)
    })
})


httpServer.listen(4040,()=>{
    console.log('Server is running on port 4040');
})