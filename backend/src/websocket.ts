import {Server} from 'socket.io';
import {createMessage, getChatById} from './models/chatsModel';

const connectedUsers = new Map();

export const initializeWebSocket = (httpServer: any) => {
    const io = new Server(httpServer,{
        cors:{
          // origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
          origin: "http://localhost:8081", 
        }
      });
      io.on('connection', (socket) => {
        socket.on('idReady', ()=>{
          // console.log(`asking user ${socket.id} for id`);
          io.to(socket.id).emit('askId', socket.id);
        })  
        socket.on('disconnect', function(){
          // console.log(`User ${socket.id} disconnected`);
          connectedUsers.delete(socket.id);
        });
        socket.on('idResponse', id =>{
          connectedUsers.set(Number(id), socket.id)
          // console.log(`user with socketId ${socket.id} assosciated with id ${id}`)
        })
        socket.on('message', async (msg) => {
          // console.log("received message:",  msg);
          // console.log("connected users: ", connectedUsers);
          const {senderId, message, chatId} = msg;
          await createMessage(chatId, senderId, message, new Date().toISOString());
          // console.log("message saved to database");
          socket.to(socket.id).emit('messageReceived', msg);
          const chat = await getChatById(chatId);
          // console.log("chat: ", chat);
          if(chat){
            const {momId, volunteerId} = chat;
            if(senderId === momId && connectedUsers.has(volunteerId)){
              // console.log("sending message to volunteer");
              io.to(connectedUsers.get(volunteerId)).emit('message', msg);
            }
            if(senderId === volunteerId && connectedUsers.has(momId)){
              // console.log("sending message to mom");
              io.to(connectedUsers.get(momId)).emit('message', msg);
            }
          }
        });
      }); 
    
    return io;
  };