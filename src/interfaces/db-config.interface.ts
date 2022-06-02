export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  synchronize: boolean;
  logging: boolean;
}
