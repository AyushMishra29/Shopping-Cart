//Importing express package
const express = require('express');
const router = express.Router();

//Importing the handler functions of userController
const { createUser , loginUser , getUser , updateUser }= require("../controllers/userController")

//Importing the  middlewares
const { authentication , authorisation }= require("../middlewares/auth")

//First API -: Registering a user using POST method
router.post("/register" , createUser)

//Second API -: To login a user using POST method
router.post("/login" , loginUser)

//Third API -: To get the user details of a user using GET method
router.get("/user/:userId/profile" , authentication , authorisation , getUser)

//Fourth API -: To update user details by userId (recieved from path params) using PUT method
router.put("/user/:userId/profile" , authentication , authorisation , updateUser)

//Exporting route file
module.exports = router;
