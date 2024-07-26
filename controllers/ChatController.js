import ChatModel from "../models/ChatModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, InternalServerError } from "../errors/CustomAPIError.js";

export const initiateChat = async (req, res) => {
  // Check if there is a chat between them 
  const previousChat = await ChatModel.find({ users: { $all: [ req.body.firstUser, req.body.secondUser ]}});
  if(previousChat.length > 0){
    return res.status(StatusCodes.OK).json(previousChat[0]);
  } 
  else if(previousChat.length === 0){
    const newChat = await ChatModel.create({ users: [ req.body.firstUser, req.body.secondUser ]});
    if(newChat){ 
      return res.status(StatusCodes.CREATED).json(newChat);
    }
    throw new BadRequestError('Bad request');
  }
  throw new InternalServerError('An error occurred');
}

export const getUserChats = async (req, res ) => {
  const chats = await ChatModel.find({ users: { $in: [req.params.userId]}}); 
  if(chats){
    return res.status(StatusCodes.OK).json(chats);
  }
  throw new BadRequestError('Bad request');
}

