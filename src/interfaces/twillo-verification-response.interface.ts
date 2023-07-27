import { STATUS_VERIFICATION_TWILLO } from '@/constants';

export interface TwilloVerificationResponse {
  sid: string;
  service_sid: string;
  account_sid: string;
  to: string;
  channel: string;
  status: STATUS_VERIFICATION_TWILLO;
  valid: string;
  amount?: string;
  payee?: string;
  sna_attempts_error_codes?: any;
  date_created: string;
  date_updated: string;
}
