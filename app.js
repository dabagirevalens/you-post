const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const dbConnect = require('./dbConnection')
const routes = require('./routes')

const app = express();

app.use(morgan('dev')); // this packages helps to log meaningful logs while development
app.use(express.json({ extendUrl: true})); // this is to recognize incoming requests as JSON Objects
app.use(cors()) //allow access from any source 

//connecting to database
dbConnect();

//expose all endpoints so that they can be used
app.use('/api/v1/', routes);

//setting app swagger docs
const { swaggerJsdoc, swaggerUi } = require('./utils/swagger')
const swaggerJson = require("./swagger.json");
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson, { explorer: true }));

module.exports = app;