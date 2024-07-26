import { StatusCodes } from "http-status-codes";
import transport from "../utils/email.js";

export const sendEmail = async (req, res) => {
  const message = {
    from: 'ayodejioladapo96@gmail.com',
    to: 'ayodejioladapo15@gmail.com',
    subject: 'Hello',
    text: 'Mailtrap and Nodemailer',
  }

  transport.sendMail(message, (err, info) => {
    if(err){
      res.status(400).json(err)
    }

    res.status(201).json({ message: 'Sent', res: info.response})

  });
}