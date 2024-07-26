import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/CustomAPIError.js';

export default async function auth(req, res, next){
  const authorizationHeader = req.headers.authorization;
  if(!authorizationHeader || !authorizationHeader.startsWith('Bearer')){
    throw new UnAuthenticatedError('Not authorized');
  }

  const token = authorizationHeader.split(' ')[1];

  // Verify that the token 
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    // Create a new user object;
    req.user = { userId: payload.userId };

  } catch (error) {
    throw new UnAuthenticatedError('Not authorized');
  }
  next();
}
