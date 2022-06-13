import { DbConnection } from '@/database/dbConnection';
import { plainToInstance } from 'class-transformer';

export function RawQuery(query: string, classTransform?: any) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = async (...args: any[]) => {
      const con = await DbConnection.getConnection();
      const rs = con?.manager.query(query, args);
      if (classTransform) return plainToInstance(classTransform, rs);
      return rs;
    };
  };
}
