process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import 'reflect-metadata';
import App from '@/app';

const app = new App();
app.listen();
