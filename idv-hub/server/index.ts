import './common/env';
import Server from './common/server';
import routes from './routes';

const port = parseInt(process.env.PORT);
const sslPort = parseInt(process.env.SSL_PORT);

export default new Server().router(routes).listen(port,sslPort);
