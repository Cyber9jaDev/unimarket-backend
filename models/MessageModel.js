import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  message: { type: String },
  senderId: { type: String },
  chatId: { 'type': String }
}, { timestamps: true });

const MessageModel = model('messages', MessageSchema);


export default MessageModel;