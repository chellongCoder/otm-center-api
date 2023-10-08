export class Constant {
  public static ACTIVE_ACCOUNT_EMAIL_TITLE = 'Active Email';
  public static ACTIVE_ACCOUNT_EMAIL_TEMPLATE = 'active-account';
  public static WELCOME_EMAIL_TITLE = 'Welcome Email';
  public static WELCOME_EMAIL_TEMPLATE = 'welcome';
  public static FORGOT_PASSWORD_EMAIL_TITLE = 'Forgot password email';
  public static FORGOT_PASSWORD_EMAIL_TEMPLATE = 'forgot-password';
  public static FORGOT_PASSWORD_URL = 'http://localhost/forgot';
  public static FORGOT_PASSWORD_URL_ERR = 'http://localhost/login';
  public static ACTIVE_ACCOUNT_REDIRECT_URL = 'http://localhost/active';
}
export enum STATUS_VERIFICATION_TWILLO {
  APPROVED = 'approved',
  PENDING = 'pending',
  CANCELED = 'canceled',
}

export enum LANGUAGES {
  VI = 'VI',
  EN = 'EN',
}
export enum WorkerConstant {
  WORKING_SEND_NOTIFICATION_SETUP = 'WORKING_SEND_NOTIFICATION_SETUP',
}
export enum TimeFormat {
  date = 'DD/MM/YYYY',
  hours = 'HH:mm',
  time = 'HH:mm:ss',
}
export enum TTLTime {
  default = 300, // 5*60
  day = 86400, // 60*60*24
  month = 2592000, // 60*60*24*30
}
