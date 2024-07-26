import express from 'express';
import { product, getProducts, ProductPreview, getUserAds, deleteAd } from '../controllers/ProductController.js';
const ProductRouter = express.Router();
import authenticateUser from '../middleware/auth.js';

ProductRouter.route('/post-ad').post(authenticateUser, product);
ProductRouter.route('/category/:category/:school').get(getProducts);
ProductRouter.route('/:category/:id').get(ProductPreview);
ProductRouter.route('/user-ads/id/:userId').get(getUserAds);
ProductRouter.route('/user-ads/id/:productId').delete(deleteAd);

export default ProductRouter;