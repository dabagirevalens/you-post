const mongoose = require("mongoose");

require('dotenv').config({ path: './env' })

const dbConnect = () => {
    mongoose
        .connect(process.env.DB_CONNECTION_RUL || `mongodb://127.0.0.1:27017/youpostdb`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((con) => {
            console.log(`DB connect on HOST : ${con.connection.host}`);
        })
};

module.exports = dbConnect;
