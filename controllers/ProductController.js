import { StatusCodes } from "http-status-codes";
import { BadRequestError, InternalServerError } from "../errors/CustomAPIError.js";
import Product from "../models/ProductModel.js";
import cloudinary from '../utils/cloudinary.js';


export const product = async (req, res) => {
  const { images } = req.body;

  const imagesBuffer = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.unsigned_upload(images[i], process.env.CLOUDINARY_UPLOAD_PRESET_NAME, {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: 'unimarket/posts'
    });
    imagesBuffer.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  if(imagesBuffer.length < 1){
    throw new BadRequestError('An error occurred while uploading images');
  }

  req.body.images = imagesBuffer;

  const post =  await Product.create(req.body);

  if(!post){
    throw new BadRequestError('An error occurred while posting advert');
  }

  return res.status(StatusCodes.CREATED).json({message: 'Advert successfully posted'});
}

export const getProducts = async (req, res) => {
  // params
  const { category, school } = req.params;
  const parameters = { category, school }

  // queries
  const { minPrice, maxPrice, pageSize, page, sortBy, dateFrom, dateTo, searchText } = req.query
  const queries = { 
    page: parseInt(page), 
    pageSize: parseInt(pageSize), 
    minPrice:parseInt(minPrice), 
    maxPrice:parseInt(maxPrice), sortBy, 
    dateFrom:parseInt(dateFrom), 
    dateTo: parseInt(dateTo), searchText 
  }

  if(parameters.category === 'all'){ delete parameters.category}
  if(parameters.school === 'all'){ delete parameters.school}

  if((typeof queries.minPrice) === 'string' || queries.minPrice < 1 || isNaN(queries.minPrice)){ 
    return { ...queries, minPrice: 1 }
  }

  if((typeof queries.maxPrice) === 'string' || queries.maxPrice > 99000000 || isNaN(queries.maxPrice)){ 
    return { ...queries, maxPrice: 99000000 }
  }

  if(queries.searchText && queries.searchText !== ''){
    const products = await Product.find({ ...parameters })
      .limit(queries.pageSize)
      .skip((queries.page - 1) * queries.pageSize)
      .where("price").gte(queries.minPrice).lte(queries.maxPrice)
      .where("createdDate").gte(queries.dateFrom).lte(queries.dateTo)
      .where('name', { $regex: queries.searchText, $options: 'i' })
      .sort({price: sortBy})

    const totalPages = await Product.find({ ...parameters })
      .where("price").gte(queries.minPrice).lte(queries.maxPrice)
      .where("createdDate").gte(queries.dateFrom).lte(queries.dateTo)
      .where('name', { $regex: queries.searchText, $options: 'i' })
      .countDocuments();

      if(!products){
        return res.status(404).json({ message: 'No products found'});
      }

      return res.status(StatusCodes.OK).json({
        products,
        totalPages: Math.ceil( totalPages / queries.pageSize),
        currentPage: queries.page,
      });
  } 
  const products = await Product.find({ ...parameters })
    .limit(queries.pageSize)
    .skip((queries.page - 1) * queries.pageSize)
    .where("price").gte(queries.minPrice).lte(queries.maxPrice)
    .where("createdDate").gte(queries.dateFrom).lte(queries.dateTo)
    .sort({price: sortBy})

  const totalPages = await Product.find({ ...parameters })
    .where("price").gte(queries.minPrice).lte(queries.maxPrice)
    .where("createdDate").gte(queries.dateFrom).lte(queries.dateTo)
    .countDocuments();

  if(!products){
    return res.status(404).json({ message: 'No products found'});
  }

  return res.status(StatusCodes.OK).json({
    products,
    totalPages: Math.ceil( totalPages / queries.pageSize),
    currentPage: queries.page,
  });

}

export const ProductPreview = async (req, res) => {
  const { id:productId } = req.params;
  const product = await Product.find({_id: productId});
  if(!product){
    return res.status(404).json({ message: 'No product found'});
  }
  return res.status(StatusCodes.OK).json(product[0]);
}

export const getUserAds = async (req, res) => {
  const { userId } = req.params;
  const activeAds = await Product.find({ sellerId: userId });
  if(!activeAds){
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No ads found'});
  }
  return res.status(StatusCodes.OK).json(activeAds);
}

export const deleteAd = async (req, res) => {
  const { productId } = req.params;
  const ad = await Product.findOneAndDelete({ _id: productId });
  if(!ad){
    throw new InternalServerError('An error occurred while deleting advert');
  }
  return res.status(StatusCodes.OK).json({message: 'Advert successfully deleted'});
}