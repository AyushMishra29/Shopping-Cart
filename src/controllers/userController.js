//Importing bcrypt, jsonwebtoken packages
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Importing the userModel
const UserModel = require("../models/userModel")

//Importing validators
const { isValid , isValidObjectId , validateEmail , validatephone } = require("../validators/validator")

//Importing uploadFile function of aws
const { uploadFile } = require("../aws/aws-sdk")

//====================================================================================================//

//First API function(Register)
const createUser = async (req, res) => {
    try {
        const query = req.query
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }

        //Checking if no data is present in our request body
        let data = req.body
        if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, message: "Please enter your details to register" })
        }
        
        //Checking if user has entered these mandatory fields or not
        const { fname, lname, email, phone, password, address } = data
        
        if (!isValid(fname)) {
             return res.status(400).send({ status: false, message: "fname is required" })
             }  

        if (!isValid(lname)) { 
            return res.status(400).send({ status: false, message: "lname is required" }) 
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required" })
            }

        if (!validateEmail(email)){
        return res.status(400).send({status: false , message: "Please enter a valid email"})
        }

        //Checking if email is unique or not
        let uniqueEmail = await UserModel.findOne({email : email})
        if (uniqueEmail) {
            return res.status(400).send({status: false , message: "Email already exists"})
        }

        if (!isValid(phone)) { 
            return res.status(400).send({ status: false, message: "phone is required" })
         }

        if (!validatephone(phone)){
        return res.status(400).send({status: false , message: "Please enter a valid phone"})
        }

         //Checking if phone is unique or not
        let uniquephone = await UserModel.findOne({phone : phone})
        if (uniquephone) {
           return res.status(400).send({status: false , message: "phone already exists"})
        }

        if (!isValid(password)) { 
           return res.status(400).send({ status: false, message: "Password is required" }) 
        }
        //Checking if password contains 8-15 characters or not
        if (password.length < 8 && password.length > 15){
        return res.status(400).send({status: false , message: "The length of password should be in between 8-15 characters"})
        }
        // Hashing the passwords
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // const address = JSON.parse(data.address)
        
        if (!isValid(address.shipping.street)) { 
            return res.status(400).send({ status: false, message: "Street is required" }) 
         }
        if (!isValid(address.shipping.city)) { 
            return res.status(400).send({ status: false, message: "city is required" }) 
         }
        if (!isValid(address.shipping.pincode)) { 
            return res.status(400).send({ status: false, message: "pincode is required" }) 
         }
         if (!isValid(address.billing.street)) { 
            return res.status(400).send({ status: false, message: "Street is required" }) 
         }
        if (!isValid(address.billing.city)) { 
            return res.status(400).send({ status: false, message: "city is required" }) 
         }
        if (!isValid(address.billing.pincode)) { 
            return res.status(400).send({ status: false, message: "pincode is required" }) 
         }

        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            var uploadedFileURL = await uploadFile(files[0])
            
        }
        else {
            return res.status(400).send({ status: false, message: "profileImage is required" }) 
        }

        const user = {
            fname: fname,
            lname: lname,
            email: email,
            profileImage: uploadedFileURL,
            phone: phone,
            password: hashedPassword,
            address: {
                shipping: {
                    street: address.shipping.street,
                    city: address.shipping.city,
                    pincode: address.shipping.pincode
                },
                billing: {
                    street: address.billing.street,
                    city: address.billing.city,
                    pincode: address.billing.pincode
                }

            }
       }
           
        //If all these validations passed , registering a user
        let UserData = await UserModel.create(user)
        return res.status(201).send({status: true , message: "You're registered successfully", data: UserData })


    }

    //Exceptional error handling
    catch (error) {
        console.log(error)
        return res.status(500).send({status: false , message: error.message })
   }
}

//=====================================================================================================//

//Second API function(Login User)
const loginUser = async (req , res) => {
    try {
        const query = req.query
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }

        //Checking if no data is present in our request
        let data = req.body
        if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, message: "Please enter your details to login" })
        }

        //Checking if user has entered these mandatory fields or not
        const { email, password } = data

        if (!isValid(email)) {
             return res.status(400).send({ status: false, message: "Email is required" })
             }  

        if (!isValid(password)) { 
            return res.status(400).send({ status: false, message: "Password is required" }) 
        }

        //Matching that email  with a user document in our UserModel
        const userMatch = await UserModel.findOne({ email: email })
        //If no such user found 
        if (!userMatch) {
            return res.status(401).send({ status: false, message: "Sorry this email does not exists in our records" })
        }
        // make a comparison between entered password and the database password
        const validUserPassword = await bcrypt.compare(
	      data.password,
	      userMatch.password
        );
        if (!validUserPassword) {
	    return response.status(401).send("Sorry the password is invalid");
        }

        //Creating a token if email and password matches
        const token = jwt.sign({
            userId: userMatch._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (10*60*60)
        }, "Secret-Key-given-by-us-to-secure-our-token")
        
        //Setting back that token in header of response
        //res.setHeader("x-api-key", token);
        
        //Sending response on successfull login
        return res.status(200).send({ status: true, message: "You are successfully logged in", 
        data: {
            userId: userMatch._id,
            token: token
            }
     })
    
    }
    //Exceptional error handling
    catch (error) {
        console.log(error)
        return res.status(500).send({status: false , message: error.message })
   }
}

//===================================================================================================================================//

const getUser = async (req , res) => {
    try {
        const query = req.query
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }

        let User_Id = req.params.userId

        //Checking if user Id is a valid type Object Id or not
        if (!isValidObjectId(User_Id)){
            return res.status(400).send({status: false , message: `${User_Id} is not valid type user Id`})
            }

        //Validate: The userId is valid or not.
        let user = await UserModel.findById(User_Id)
        if (!user) {
        return res.status(404).send({ status: false, message: "user does not exists" })
       }

       //Validate: If the userId exists (must have isDeleted false)
       let is_Deleted = user.isDeleted
       if (is_Deleted == true) {
           return res.status(404).send({ status: false, message: "user does not exists" })
       }

       //Sending the response in the required format
       return res.status(200).send({status: true, message: "User data" , data: user})

    }

    //Exceptional error handling
    catch (error) {
        console.log(error)
        return res.status(500).send({status: false , message: error.message })
   }
}

//===================================================================================================================================//

const updateUser = async (req , res) => {
    try {
        const query = req.query
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }

        let User_Id = req.params.userId
        //Checking if User Id is a valid type Object Id or not
        if (!isValidObjectId(User_Id)){
            return res.status(400).send({status: false , message: `${User_Id} is not valid type user Id`})
            }
        //Validate: The UserId is valid or not.
        let User = await UserModel.findById(User_Id)
        if (!User) return res.status(404).send({ status: false, message: "User does not exists" })

        //Validate: If the UserId exists (must have isDeleted false)
        let is_Deleted = User.isDeleted
        if (is_Deleted == true) return res.status(404).send({ status: false, message: "User does not exists" })
        
        //Checking if no data is present in request body
        let data = req.body
        if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, message: "Please provide some data to update a User document" })
        }

        //Updates a User by changing these values 
        const { fname, lname, email, phone, password, address } = req.body
        
        if (!validateEmail(email)){
            return res.status(400).send({status: false , message: "Please enter a valid email"})
            }
        //Checking if email is unique or not
        let uniqueEmail = await UserModel.findOne({email : email})
        if (uniqueEmail) {
            return res.status(400).send({status: false , message: "Email already exists"})
        }

        if (!validatephone(phone)){
            return res.status(400).send({status: false , message: "Please enter a valid phone"})
            }
    
        //Checking if phone is unique or not
        let uniquephone = await UserModel.findOne({phone : phone})
        if (uniquephone) {
             return res.status(400).send({status: false , message: "phone already exists"})
            }

        //Checking if password contains 8-15 characters or not
        if (password.length < 8 && password.length > 15){
            return res.status(400).send({status: false , message: "The length of password should be in between 8-15 characters"})
            }
         // Hashing the passwords
         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(password, salt);

         let files = req.files
         if (files && files.length > 0) {
             //upload to s3 and get the uploaded link
             // res.send the link back to frontend/postman
             var uploadedFileURL = await uploadFile(files[0])
             
         }

        //Updating a User document
        let updatedUser = await UserModel.findOneAndUpdate({ _id: User_Id },
            {
                $set: {
                    fname: fname,
                    lname: lname,
                    email: email,
                    profileImage: uploadedFileURL,
                    phone: phone,
                    password: hashedPassword
                }
            }, { new: true })

        //Sending the updated response
        return res.status(200).send({ status: true, message: "Your User details have been successfully updated", data: updatedUser })
    }

    //Exceptional error handling
    catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, message: error.message })
    }
}


//Exporting the above API functions 
module.exports = {
    createUser,
    loginUser,
    getUser,
    updateUser
}

