import { NextFunction, Request, Response } from 'express';
import { ExceptionCode } from '@/exceptions';
import { errorResponse } from '@/helpers/response.helper';
import { HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';

interface ErrorHandle extends HttpError {
  message?: string;
  code?: number;
  status_code?: number;
  stack: any;
}
const errorMiddleware = (err: ErrorHandle, req: Request, res: Response, next: NextFunction) => {
  const defaultMessage = `Có lỗi xảy ra, vui lòng thử lại sau`;
  const defaultExceptionCode = ExceptionCode.UNKNOWN;
  try {
    let message = '';
    let exceptionCode = 0;
    let statusCode = 0;

    if (err.message) {
      message = err.message;
      /**
       * handle error validation
       */
      if (err.message === `Invalid body, check 'errors' property for more info.`) {
        if (Array.isArray(err?.errors) && err?.errors?.every(element => element instanceof ValidationError)) {
          err?.errors?.forEach((element: ValidationError) => {
            Object.keys(element?.constraints).forEach(type => {
              message = `${element?.constraints[type]}`;
            });
          });
        }
      }
    }

    if (err.code) {
      exceptionCode = err.code;
    }

    if (err.status_code) {
      statusCode = err.status_code;
    }
    console.log('chh_log ---> errorMiddleware:', {
      message: err.message,
      stack: err.stack,
    });
    return errorResponse({
      req,
      res,
      status_code: statusCode,
      message: message || defaultMessage,
      exception_code: exceptionCode || defaultExceptionCode,
    });
  } catch (error) {
    errorResponse({
      req,
      res,
      status_code: 0,
      message: defaultMessage,
      exception_code: defaultExceptionCode,
    });
    next();
  }
};

export default errorMiddleware;
