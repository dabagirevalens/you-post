const app = require('./app');
require('dotenv').config()

const PORT = process.env.PORT || 3000 // this is a port from which our app will listen or start from local computer

app.listen(PORT, _=> console.log(`App is running on Port:${PORT}`));