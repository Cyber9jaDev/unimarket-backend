import mongoose from 'mongoose';
const { Schema } = mongoose;
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError } from '../errors/CustomAPIError.js';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'Please enter your name'],
    trim: true,
    minLength: [ 4, 'name must not be less than 8 characters']
  },

  email: {
    type: String,
    unique: true,
    required: [ true, 'Please enter your email'],
    index: true,
    trim: true,
    validate: {
      validator: (value) => {
        if(!validator.isEmail(value)){
          throw new Error('Invalid email');
        }
      },
      message: (props) => {
        return(`${props.value} is not a valid email address`);
      },
    }
  },

  phone: {
    type: Number,
    trim: true,
    unique: true,
    required: [true, 'Please enter a phone number']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters long']
  },

  token: {
    type: String,
    default: ''
  },

  cart: {
    type: Object,
    default: {
      total: 0,
      count: 0
    }
  }, 

  createdAt: {
    type: Date,
    default: Date.now()
  },

  modifiedAt: {
    type: Date,
    default: Date.now()
  },

  displayPicture: {
    public_id: {
      type: String,
      default: null
    },
    url:{
      type: String,
      default: null
    }
  },

  hasDisplayPicture: {
    type: Boolean,
    default: false
  },

  school: {
    type: String,
    default: '',
    trim: true,
  }

}, { minimize: false });


UserSchema.statics.findUser = async function(email){
  const user = await User.findOne({email});
  if(!user){
    throw new NotFoundError('User not found');
  }
  return user;
}

UserSchema.methods.comparePassword = async function(password){
  const isMatch = await bcrypt.compare(password, this.password);
  
  if(!isMatch){
    throw new BadRequestError('Wrong Password');
  }
  return isMatch // true
}


UserSchema.methods.createJWT = function (){
  return jwt.sign({ userId : this._id }, process.env.JWT_SECRET, { expiresIn : process.env.JWT_LIFETIME} )
}

// Hash the password before saving to the database
UserSchema.pre('save', async function (){
  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// remove password from item// 
UserSchema.methods.toJSON = function(){
  const { password, ...rest } = this.toObject();
  return rest;
}

const User = mongoose.model('User', UserSchema);

export default User;