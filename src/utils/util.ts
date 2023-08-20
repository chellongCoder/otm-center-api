import { randomInt } from 'crypto';
import ejs from 'ejs';
import path from 'path';
import { suid } from 'rand-token';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import moment from 'moment-timezone';
const i = 'Notes app'; // Issuer
const s = 'demo@hisoft.com.vn'; // Subject
const a = 'http://hisoft.com.vn'; // Audience
// SIGNING OPTIONS
const signOptions: jwt.SignOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: '1h',
  algorithm: 'RS256',
};
// VERIFY OPTIONS
const verifyOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: '1h',
  algorithm: ['RS256'],
};

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const generateRandToken = (): string => {
  return suid(64);
};

export const generateRecoveryCode = (): number => {
  return randomInt(1000, 9999);
};

export const generateAccessToken = (payload: string | object): string => {
  const privateKEY = fs.readFileSync(path.join(__dirname, 'keys/private.key'), 'utf8');
  return jwt.sign(payload, privateKEY, signOptions);
};

export const verifyAccessToken: any = (token: string) => {
  const publicKEY = fs.readFileSync(path.join(__dirname, 'keys/public.key'), 'utf8');
  return jwt.verify(token, publicKEY, verifyOptions);
};

export const templateToString = (templateUrl: string, params: any): string => {
  const template = fs.readFileSync(templateUrl);
  return ejs.render(template.toString(), params);
};

export const fixPhoneVN = (phone: string) => {
  let phoneNumber = '';
  if (phone[0] === '0') {
    phoneNumber = '+84' + phone.substring(1);
  }
  return phoneNumber;
};
export const calculateNextStepCycle = (dayOfWeek: number, startDate: string): string => {
  // Convert the start date string to a moment object
  const startDateMoment = moment(startDate, 'YYYY-MM-DD');

  // Calculate the number of days between the start date and the desired day of the week for the next cycle
  const daysUntilNextCycle = (dayOfWeek - startDateMoment.day() + 7) % 7;

  // Add the appropriate number of days to the start date to get the schedule date for the next step cycle
  const nextStepCycleDate = startDateMoment.add(daysUntilNextCycle, 'days').format('YYYY-MM-DD');

  return nextStepCycleDate;
};
