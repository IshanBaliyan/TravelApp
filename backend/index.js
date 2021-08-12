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

const MONGODB_PASSWORD = "MongoDB@321";

dotenv.config();

app.use(express.json())

// simply taken below (to conne;ct to MongoDB) from the docs: https://mongoosejs.com/docs/connections.html
// Normally, use thef following (but I'm showing url for deploying app to a website):
// mongoose
//     .connect(process.env.MONGO_URL, {
//          useNewUrlParser: true, 
//          useUnifiedTopology: true 
//     })
// const cors = require('cors');
// app.use(cors({credentials : true}));
// app.use(function (req, res, next) {	
//     res.setHeader('Access-Control-Allow-Origin', '*');    
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
//     res.setHeader('Access-Control-Allow-Credentials', true);    
//     next();
// });

var cors = require('cors');

// use it before all route definitions
app.use(cors({credentials : true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

mongoose
    .connect(`mongodb+srv://IshanB:${MONGODB_PASSWORD}@cluster0.86tw3.mongodb.net/pin?retryWrites=true&w=majority`, {
         useNewUrlParser: true, 
         useUnifiedTopology: true,
         useCreateIndex: true, 
    })
    .then(()=>{
        console.log("MongoDB Connected!");
    })
    .catch(err=>console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

// Try to run on heroku, if it doesn't work, run on local computer on port 8800
// The following process.env.port variable is NOT from your local env file, rather from the env file ON THE HEROKU SERVER:
app.listen(process.env.PORT || 8800, ()=>{
    console.log("Backend server is running!");
});