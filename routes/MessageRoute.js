import express from 'express';
import { initiateChat, getMessages, sendMessage } from '../controllers/MessageController.js';
const MessageRouter = express.Router();


MessageRouter.route('/create-chat', initiateChat);
MessageRouter.route('/send-message').post(sendMessage);
MessageRouter.route('/find/:chatId').get(getMessages);


export default MessageRouter;