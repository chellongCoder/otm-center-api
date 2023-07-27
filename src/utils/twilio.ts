import config from 'config';

const accountSid = config.get('twilio.accountSID');
const authToken = config.get('twilio.authToken');
const TWILIO_SERVICE_ID = config.get('twilio.verifySid');

export const twilioService = require('twilio')(accountSid, authToken).verify.v2.services(TWILIO_SERVICE_ID);
