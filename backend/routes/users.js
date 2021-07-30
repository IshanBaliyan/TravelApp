const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register:
//(use "http://localhost:8800/api/users/register" on Postman for testing)
router.post("/register", async (req,res)=>{
    try{
       //Generate new password:
        // Use bcrypt to make a new password and sort of "censor" the real password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

       //Create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

       //Save user and send response
       const user = await newUser.save();
       res.status(200).json(user._id);
    }catch(err){
        res.status(500).json(err);
    }
});

//Login:
//(use "http://localhost:8800/api/users/login" on Postman for testing)

router.post("/login", async (req, res)=>{
    try{

        //FIND USER
        const user = await User.findOne({username:req.body.username})

        // The following will execute when there is a wrong username (400 error).
        // We are saying "username or password" so the hacker doesn't know which one is wrong
        !user && res.status(400).json("Wrong username or password");

        //VALIDATE PASSWORD
        // Since the code has made it to this line, we have a correct username and are
        // now going to validate the password.

        // Using bcrypt for validation and better password encryption
        const validPassword = await bcrypt.compare(
            req.body.password, 
            user.password
        );

        // The following will execute when there is a wrong password (400 error).
        // We are saying "username or password" so the hacker doesn't know which one is wrong
        !validPassword && res.status(400).json("Wrong username or password");

        // SEND RESPONSE
        res.status(200).json({_id: user._id, username: user.username});

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router