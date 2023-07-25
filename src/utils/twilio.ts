// const accountSid = config.get('twilio.twilioSID') || 'AC01d83499e15dcdd5fd08a501befaecd9';
const accountSid = 'ACf2a237ee3d729e55e99963e94d07d7c0';
// const authToken = config.get('twilio.twilioToken') || '3a58d9a9ce28bbf43bd423e6a6e55209';
const authToken = 'e320d42affaa620b148da7564ad4fb86';

// const TWILIO_SERVICE_ID = config.get('twilio.twilioService') || 'VA873534b8b8a52e8cd0dcc8826443bf3d';
const TWILIO_SERVICE_ID = 'VAdf643dc29c9c5a3b973d533da3e866b2';

export const twilioService = require('twilio')(accountSid, authToken).verify.v2.services(TWILIO_SERVICE_ID);
