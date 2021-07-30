const router = require("express").Router();

const Pin = require("../models/Pin");

//Create a pin:
// Testing with Postman
router.post("/", async (req,res)=>{
    const newPin = new Pin(req.body)
    try{

        // await and load the following newPin save function. When it's
        // done loading, then execute the line after (res.status(200)....)
        const savedPin = await newPin.save();
        // set to 200, meaning successful
        res.status(200).json(savedPin);
    }catch(err){
        // set to 500, meaning failure
        res.status(500).json(err)
    }
});

//Get all pins:
// Testing with Postman
router.get("/", async (req,res) => {
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(er)
    }
});

module.exports = router