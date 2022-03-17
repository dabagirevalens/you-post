const swaggerDocs = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    openapi: "1.0.0",
    definition: {
        components: {},
        consumes: ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"],
        produces: ["application/json"],
        basePath: "/",
    },
    apis: ["./routes/*.js"],
};

const swaggerJsdoc = swaggerDocs(options);


module.exports = {
    swaggerJsdoc,
    swaggerUi
}