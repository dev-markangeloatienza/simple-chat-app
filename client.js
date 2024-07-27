const socket = io('localhost:4040');
const messageContainer = document.getElementById('message-container')
const messageField = document.getElementById('message-field')
const sendMessage = document.getElementById('send')
const roomBtns = document.querySelectorAll(".room-button")
let roomId
let broadcast = "m1"
socket.on('connect',()=>{
    console.log("Connection established to server with ID %s",socket.id)
})

roomBtns.forEach(element => {
    element.addEventListener('click',()=>{
        roomId = element.dataset.roomId
        socket.emit('room:join',roomId)
    })
});

sendMessage.addEventListener('click', ()=>{
    let message = messageField.value
    socket.emit('room:message',{
        roomId,
        message
    })
    messageField.value= ''
})

socket.on('room:connected',(msg)=>{
    console.log(`${msg}`)
})

socket.on('room:message',(data)=> {
    console.log("ROOM DATA: ", data)
    console.log(`Message from room ${data.sender}: ${data.message}`)
    messageContainer.innerHTML += `<p>${data.sender}: ${data.message}</p>`
})

let count = 0
// socket.volatile.emit('message:send',"Hi, world!")

// setInterval(()=>{
//     socket.volatile.emit('message:send',`Hi world ${count++}!`)
// },1000)





socket.on('disconnect',(reason)=>{
    if(reason === 'io server disconnect'){
        socket.connect()
    }
})