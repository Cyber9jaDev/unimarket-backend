import express from 'express';
const UserRouter = express.Router();

import { login,  getAllUsers, register, getUser, uploadProfilePicture, updateUserProfile } from '../controllers/UserController.js';

UserRouter.route('/users').get(getAllUsers);
UserRouter.route('/user/:userId').get(getUser);
UserRouter.route('/register').post(register);
UserRouter.route('/login').post(login);
UserRouter.route('/upload-profile-picture/:userId').patch(uploadProfilePicture);
UserRouter.route('/update-user-info').patch(updateUserProfile);

export default UserRouter;