import { StatusCodes } from "http-status-codes";
import MessageModel from "../models/MessageModel.js";
import { BadRequestError, InternalServerError } from "../errors/CustomAPIError.js";

export const initiateChat = async () => {
  const message = await MessageModel.create({ senderId, receiverId });

  if(message){
    return res.status(StatusCodes.CREATED).json(message);
  }
  throw new BadRequestError('An error occurred');
}

export const getMessages  = async (req, res) => {
  const { chatId } = req.params;
  const chats = await MessageModel.find({ chatId });
  if(chats){
    return res.status(StatusCodes.OK).json(chats);
  }
  throw new InternalServerError('An error occurred');
}

export const sendMessage = async(req, res) => {
  const { senderId, chatId, receiverId, message } = req.body;
  const newMessage = await MessageModel.create({ senderId, receiverId, message, chatId });
  if(newMessage){
    return res.status(StatusCodes.CREATED).json(newMessage);
  }

  throw new InternalServerError('An error occurred');
}