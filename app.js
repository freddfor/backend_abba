require("dotenv").config();
const Server = require("./app.server");

require('dayjs/locale/es')
const dayjs = require('dayjs')
// import 'dayjs/locale/de' // ES 2015 

dayjs.locale('es')

const server = new Server();

server.listen();