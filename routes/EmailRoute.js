import express from 'express';
import { sendEmail } from '../controllers/EmailController.js';
const EmailRouter = express.Router();
// import authenticateUser from '../middleware/auth.js';



// EmailRouter.route('/send-email').post(authenticateUser, sendEmail);
EmailRouter.route('/send-email').post(sendEmail);


export default EmailRouter



