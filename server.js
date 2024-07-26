import 'express-async-errors';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import {Server} from 'socket.io';
import cors from 'cors';
import http from 'http';
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    // origin: "http://localhost:3000"
    origin: "http://localhost:5000"
  // origins: ['*']
  // origin: "*"
}});
import connectDB from './db/connection.js';
import UserRouter from './routes/UserRoute.js';
import ChatRouter from './routes/ChatRoute.js';
import MessageRouter from './routes/MessageRoute.js';
import morgan from 'morgan';
import ErrorHandlingMiddleware from './middleware/ErrorHandlingMiddleware.js';
import ProductRouter from './routes/ProductRoute.js';
import NotFoundMiddleware from './middleware/NotFoundMiddleware.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let users = [];

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '50mb'}));


// JOHN SMILGA, when ready to deploy
// if(process.env.NODE_ENV === 'production'){
//   app.use(express.static(path.resolve(__dirname, './client/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
//   });
// }

// morgan middleware, only runs in development mode
if(process.env.NODE_ENV !== 'production'){ app.use(morgan('dev')) }

io.on('connection', (socket) => {
  // Add new user to socket/ users list 
  socket.on('add-new-user', (newUserId) => {
    if(!users.some(user => user.userId === newUserId)){     // If user does not exist already, add new user 
      users.push({ userId: newUserId, socketId: socket.id });
    }
    io.emit('get-users', users);    // to all clients on this node (when using multiple nodes);
  });

  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = users.find(user => user.userId === receiverId)  // Check if user exists on the server session
    if(user){
      io.to(user.socketId).emit('receive-message', data);     // to individual socketid (private message)
    }
  });

  // getActiveUsers  
  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('get-users', users);    // to all clients on this node (when using multiple nodes)
  });
});

app.use('/schools', express.static(path.join(__dirname, 'schools')));

app.use('/api', UserRouter);
app.use('/api', ProductRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/message', MessageRouter);


// Middleware
app.use(ErrorHandlingMiddleware)  // At the bottom
app.use(NotFoundMiddleware);


const startAPP = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () => console.log('LISTENING ON PORT', port));
  } catch (error) {
    console.log(error);
  }
}

startAPP();




export default app