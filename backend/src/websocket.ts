import {Server} from 'socket.io';
import {createChatRoomMessage, createMessage, getChatById} from './models/chatsModel';
import {parse} from 'cookie';
import { getSessionData, getUserIdFromSessionId } from './models/sessionModel';
import { getUserData } from './models/userModel';
const connectedUsers = new Map();
async function socketRequireAuth(socket, next){
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      console.log("no cookies found");
      return next(new Error('No cookies found'));
    }

    // Parse the session cookie
    const cookies = parse(cookieHeader);
    const dotPos = cookies['connect.sid'].indexOf('.');
    const sessionId = cookies['connect.sid'].substring(2, dotPos); // Adjust if your session cookie name differs

    // Retrieve the session
    try{
      const userId = await getUserIdFromSessionId(sessionId);
      connectedUsers.set(userId, socket.id);
      const userData = await getUserData(userId);
      const {role} = userData;
      if(role === "Volunteer" || role === "Admin"){
        socket.join("volunteerRoom");
      }
      next();
    } catch(error) {
      console.log("Authentication Error");
      console.log(error);
      next(new Error('Authentication error'));
    }


  } catch (err) {
    console.log("Other auth error");
    next(new Error('Authentication error'));
  }
}
export const initializeWebSocket = (httpServer: any) => { 
    const io = new Server(httpServer,{
        cors:{
          // origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
          origin: "http://localhost:8081", 
          credentials: true
        },
        
      });
      io.use(socketRequireAuth);
      io.on('connection', (socket) => {
        socket.on('disconnect', function(){
          // console.log(`User ${socket.id} disconnected`);
          connectedUsers.delete(socket.id);
        });
        socket.on('message', async (msg) => {
          // console.log("received message:",  msg);
          // console.log("connected users: ", connectedUsers);
          const {senderId, message, chatId} = msg;
          socket.to(socket.id).emit('messageReceived', msg);
          if(chatId === -1){ //this means the chat is going to the volunteer help room
            await createChatRoomMessage(senderId, message, new Date().toISOString());
            socket.to("volunteerRoom").emit('message', msg);
            return;
          }
          const chat = await getChatById(chatId);
          // console.log("chat: ", chat);
          if(chat){
            await createMessage(chatId, senderId, message, new Date().toISOString());
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