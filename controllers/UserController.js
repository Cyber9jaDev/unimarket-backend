import { StatusCodes } from 'http-status-codes';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors/CustomAPIError.js';
import User from '../models/UserModel.js';
import cloudinary from '../utils/cloudinary.js';

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if(!name || !email || !password || !phone) {
    throw new BadRequestError('Please provide all values');
  }

  const emailAlreadyExists = await User.findOne({ email });
  if(emailAlreadyExists){
    throw new BadRequestError('Email already exists');
  }

  const phoneAlreadyExists = await User.findOne({ phone });
  if(phoneAlreadyExists){
    throw new BadRequestError('Phone number is in use by another customer');
  }

  const user = await User.create({ name, email, password, phone });
  const token = user.createJWT();
  return res.status(StatusCodes.CREATED).json({ 
    email : user.email, 
    name : user.name,
    userId : user._id,
    phone: user.phone,
    hasDisplayPicture : user.hasDisplayPicture,
    displayPicture : user.hasDisplayPicture ? user.displayPicture : null,
    school: user.school,
    token 
  });
} 

export const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password ) {
    throw  new BadRequestError('Please provide all values');
  }

  const user = await User.findUser(email);
  const correctPassword = await user.comparePassword(password);
  const token = user.createJWT();
  
  if(user && correctPassword){
    return res.status(StatusCodes.CREATED).json({ 
      email : user.email, 
      name : user.name,
      userId : user._id,
      phone: user.phone,
      hasDisplayPicture : user.hasDisplayPicture,
      displayPicture : user.hasDisplayPicture ? user.displayPicture : null,
      school: user.school,
      token 
    });
  }
  
}

export const getAllUsers = async (req, res) => {
  const users = await User.find({ isAdmin: false });
  if(!users){
    throw NotFoundError('Users not found')
  }
  return res.status(StatusCodes.OK).json(users);
}

export const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({_id: userId});
  if(user){
    const { name, _id, email, phone, hasDisplayPicture, school, displayPicture } = user;
    return res.status(StatusCodes.OK).json({ 
      name, _id, phone, email, 
      hasDisplayPicture, 
      school, 
      displayPicture 
    });
  }
  throw new BadRequestError('An error occurred');
}

export const uploadProfilePicture = async (req, res) => {
  const { image, userId } = req.body;

  let imageBuffer = {};

  const result = await cloudinary.v2.uploader.unsigned_upload(image, process.env.CLOUDINARY_UPLOAD_PRESET_NAME, {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    folder: 'unimarket/display-pictures'
  });

  imageBuffer['public_id'] = result.public_id;
  imageBuffer['url'] = result.secure_url;

  const uploadPicture = await User.findOneAndUpdate({ _id: userId }, { displayPicture: { ...imageBuffer }, hasDisplayPicture: true }, { new: true });

  const { displayPicture, hasDisplayPicture } = uploadPicture
  if(!uploadPicture){
    throw new InternalServerError("An error occurred");
  }

  // return res.status(StatusCodes.CREATED).json({'message': 'Picture uploaded successfully'});
  return res.status(StatusCodes.CREATED).json({ displayPicture, hasDisplayPicture });
}

export const updateUserProfile = async (req, res) => {
  const { name, school, phone, userId } = req.body;

  let filter = {};

  if(name){ filter.name = name }
  if(school){ filter.school = school }
  if(phone){ filter.phone = parseInt(phone) }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, filter, { new: true });

  if(!updatedUser){ throw new BadRequestError('Bad request');}

  const { name: updatedName, school: updatedSchool, phone: updatedPhone } = updatedUser;  
  return res.status(StatusCodes.CREATED).json({ updatedName, updatedSchool, updatedPhone });;

}