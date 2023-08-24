import { OpenAPI } from 'routing-controllers-openapi';

export const SingleUpload =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: any, descriptor: PropertyDescriptor) => {
    OpenAPI({
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                [fileName]: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
