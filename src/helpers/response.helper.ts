import { ExceptionCode } from '@/exceptions';
import { Request, Response } from 'express';

interface IResponse {
  req?: Request;
  res: Response;
  data?: any;
  status_code?: number;
  message?: string;
}

interface IResponseError {
  req?: Request;
  res: Response;
  status_code?: number;
  message?: string;
  exception_code: ExceptionCode;
}

export const successResponse = ({ req, res, data, status_code, message }: IResponse) => {
  const statusCode = status_code || 204;
  return res.status(statusCode).send({
    success: true,
    message: message || 'SUCCESS',
    data,
  });
};

export const errorResponse = ({ req, res, status_code, message, exception_code }: IResponseError) => {
  const statusCode = status_code || 500;
  return res.status(statusCode).send({
    success: false,
    message,
    exception_code,
  });
};
