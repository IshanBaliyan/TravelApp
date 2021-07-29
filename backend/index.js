const express = require("express");
const mongoose = require("mongoose");

// We are using dot env (.env file with MONGO_URL VARIABLE) simply
// to protect our username/password from mongodb to be read on github by others
const dotenv = require("dotenv");
const app = express();

dotenv.config();

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

    app.post("/users/login");

app.listen(8800, ()=>{
    console.log("Backend server is running!");
});