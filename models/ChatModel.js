import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  users:{ type: Array },
}, { timestamps: true });

const ChatModel = model('chats', ChatSchema);

export default ChatModel;