import express from 'express';
import { getUserChats, initiateChat } from '../controllers/ChatController.js';
const ChatRouter = express.Router();

ChatRouter.route('/initiate-chat').post(initiateChat);
ChatRouter.route('/find/:userId').get(getUserChats);

export default ChatRouter;