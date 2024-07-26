import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProductSchema = new Schema({
  category: {
    type: String,
    default: 'all'
  },

  sellerEmail: {
    type: String,
    required: true
  },
  
  sellerId: {
    type: String,
  },
  
  price: {
    type: Number,
    trim: true,
    required: [ true, 'Please add product price']
  },

  description: {
    type: String,
    required: [ true, 'Please add product description'],
    minLength : [ 10, 'Product description must be at least 15 characters']
  },

  condition: {
    type: String,
    required: [ true, 'Please add product condition'],
  },

  name: {
    type: String,
    required: [ true, 'Please add product brand'],
  },

  school: {
    type: String,
    required: [ true, 'Please add your school'],
  },
  
  createdDate: {
    type: Number
  },
  
  modifiedDate: {
    type: Number
  },

  images: [
    {
      public_id:{
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ]

}, { timestamps: true, minimize: false });


const Product = mongoose.model('Posts', ProductSchema);

export default Product;