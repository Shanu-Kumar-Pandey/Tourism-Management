
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./database/mongoDB');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ limit: '10mb', type: '/' }));
app.use(bodyParser.urlencoded({ extended: true ,limit:10000,parameterLimit:10,}));
app.use(express.json({strict: false}));
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  setTimeout(next,0); // 3-second delay
});

const port = process.env.PORT || 5000;


var User = require("./Routes/User/main");
var Tour= require("./Routes/Tour/main")
var Booking= require("./Routes/Booking/main")
var Rating= require("./Routes/Rating/main")
User(app, db);
Tour(app, db);
Booking(app, db);
Rating(app, db);

server.listen(port, () => {
  console.log(`Server is running on http:localhost:${port}`);
});