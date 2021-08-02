const express = require("express");
const mongoose = require("mongoose");

// We are using dot env (.env file with MONGO_URL VARIABLE) simply
// to protect our username/password from mongodb to be read on github by others
const dotenv = require("dotenv");
const app = express();

// use for routing user create/get from database, and also test performance with Postman
const userRoute = require("./routes/users");

// use for routing pin create/get from database, and also test performance with Postman
const pinRoute = require("./routes/pins");



dotenv.config();

app.use(express.json())

// simply taken below (to connect to MongoDB) from the docs: https://mongoosejs.com/docs/connections.html
mongoose
    .connect(process.env.MONGO_URL, {
         useNewUrlParser: true, 
         useUnifiedTopology: true 
    })
    .then(()=>{
        console.log("MongoDB Connected!");
    })
    .catch(err=>console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

// Try to run on heroku, if it doesn't work, run on local computer on port 8800
app.listen(process.env.PORT || 8800, ()=>{
    console.log("Backend server is running!");
});