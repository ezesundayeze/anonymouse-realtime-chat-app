const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/chat";

// Use native promises
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true // Recommended for newer versions
});


module.exports = connect;
