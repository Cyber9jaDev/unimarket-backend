import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error{
  constructor(message){
    super(message); // super is used to access properties on an object literal or class's [[Prototype]], or invoke a superclass's constructor.
  }
}

export class BadRequestError extends CustomAPIError{
  constructor(message){
    super(message);  
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

export class NotFoundError extends CustomAPIError{
  constructor(message){
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

export class UnAuthenticatedError extends CustomAPIError{
  constructor(message){
    super(message);
    this.statuscode = StatusCodes.UNAUTHORIZED
  }
}

export class InternalServerError extends CustomAPIError{
  constructor(message){
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
}