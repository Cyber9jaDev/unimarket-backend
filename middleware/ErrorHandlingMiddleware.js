import { StatusCodes } from "http-status-codes";

export default function ErrorHandlingMiddleware(err, req, res, next){

  console.log(err);
  ;
  const defaultError = {
    message: err.message || 'An error occurred',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }


  if(err.name === 'ValidationError'){
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // if(err.errors.password){
    //   defaultError.message = err.errors.password.message;
    // } 
    // else if(err.errors.name){
    //   defaultError.message = err.errors.name.message;
    // }
    // else if(err.errors.email){
    //   defaultError.message = err.errors.email.message;
    // }
    // else if(err.errors.phone){
    //   defaultError.message = err.errors.phone.message;
    // }
    defaultError.message = Object.values(err.errors)
      .map(item => item.message)
      .join('\n');
  }

  else if(err.codeName === 'DuplicateKey'){
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(err.keyValue)} already in use`;
  }



  // return res.status(defaultError.statusCode).json(err);
  return res.status(defaultError.statusCode).json({ message: defaultError.message });
}