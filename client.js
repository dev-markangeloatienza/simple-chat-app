const socket = io('localhost:4040');
const messageContainer = document.querySelectorAll('.message-container')
const messageField = document.querySelectorAll('.message-field')
const sendMessage = document.querySelectorAll('.send-button')
const roomBtns = document.querySelectorAll(".room-button")

const messageContainerFilter = (roomId) => {
    return Object.values(messageContainer).filter(item => item.dataset.roomId === roomId)
}

const inputMessageFilter = (roomId) => {
    return Object.values(messageField).filter(item => item.dataset.roomId === roomId)
}


socket.on('connect',()=>{
    console.log("Connection established to server with ID %s",socket.id)
})

roomBtns.forEach(element => {
    element.addEventListener('click',()=>{
        let roomId = element.dataset.roomId
        element.textContent = "Joined"
        element.disabled= true
        socket.emit('room:join',roomId)
    })
});

sendMessage.forEach(element=> {
    element.addEventListener('click', (e)=>{
        e.preventDefault()
        let roomId = element.dataset.roomId
        let message = inputMessageFilter(roomId)
        socket.emit('room:message',{
            roomId,
            message: message[0].value
        })
        message[0].value= ''
    })
})

socket.on('room:connected',(msg)=>{
    console.log(`${msg}`)
})

socket.on('room:message',(data)=> {

    let roomId = data.roomId
    let msgContainer = messageContainerFilter(roomId)

    msgContainer[0].innerHTML += `<p>${data.sender}: ${data.message}</p>`
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