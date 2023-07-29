import { NextFunction, Request, Response } from 'express';
import { ExceptionCode } from '@/exceptions';
import { errorResponse } from '@/helpers/response.helper';
import { ValidationError } from 'class-validator';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Service } from 'typedi';

// @Middleware({ type: 'after' })
// @Service()
// export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(
    // err: { message?: string; code?: number; status_code?: number; stack: any },
    error: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log('chh_log ---> error:', error);
    try {
      // res.status(error.httpCode || 500);
      // res.json({
      //   name: error.name,
      //   message: error.message,
      //   errors: error[`errors`] || [],
      // });
      // next();
      return;
      // this.log.error(error.name, error.message);

      // console.log('chh_log ---> error ---> err:', err);
      // const defaultMessage = `Có lỗi xảy ra, vui lòng thử lại sau`;
      // const defaultExceptionCode = ExceptionCode.UNKNOWN;
      // let message = '';
      // let exceptionCode = 0;
      // let statusCode = 0;

      // if (err.message) {
      //   message = err.message;
      //   /**
      //    * handle error validation
      //    */
      //   if (err.message === `Invalid body, check 'errors' property for more info.`) {
      //     if (Array.isArray(err?.errors) && err?.errors.every(element => element instanceof ValidationError)) {
      //       err?.errors.forEach((element: ValidationError) => {
      //         Object.keys(element.constraints).forEach(type => {
      //           message = `${element.constraints[type]}`;
      //         });
      //       });
      //     }
      //   }
      // }

      // if (err.code) {
      //   exceptionCode = err.code;
      // }

      // if (err.status_code) {
      //   statusCode = err.status_code;
      // }
      // console.log('chh_log ---> errorMiddleware:', {
      //   message: err.message,
      //   stack: err.stack,
      // });
      // return errorResponse({
      //   req,
      //   res,
      //   status_code: statusCode,
      //   message: message || defaultMessage,
      //   exception_code: exceptionCode || defaultExceptionCode,
      // });
    } catch (error) {
      console.log('chh_log ---> errorMiddleware ---> error:', error);
      next(error);
    }
  }
}
