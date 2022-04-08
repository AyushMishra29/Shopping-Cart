//Importing redis & shortid packages
const shortid = require('shortid')
const redis = require("redis");

const { promisify } = require("util");

//Importing the urlModel
const URLModel = require("../models/urlModel")

//Connect to redis
const redisClient = redis.createClient(
  14564,
  "redis-14564.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("AZQXHFyqf7wxNoDHSJQePMPbWjnfOSTj", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


//Creating a validation function
const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { 
        return false 
    }
    if (typeof (value) === "string" && (value).trim().length > 0) {
         return true 
    }
}

//Creating our first handler function
const URLshorten = async (req , res) => {
    try {
        const baseUrl = 'http://localhost:3000'

        const query = req.query
        console.log(query)
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }

        const data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({status: false , message: "Please provide URL"})
        }

        const { longUrl } = data
       
        if (!isValid(longUrl)) {
            return res.status(400).send({status: false , message: "Please provide URL"})
        }

        //Checking if user entered a valid URL or not
        let validateLongUrl = function (longUrl) {
            return /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(longUrl)
        }
        if (!validateLongUrl(longUrl)){
        return res.status(400).send({status: false , message: "Please enter a valid longUrl"})
        }

        const urlGenerated = shortid.generate()
        const urlCode = urlGenerated.trim().toLowerCase()

        let url = await URLModel.findOne({longUrl}).select({longUrl: 1 , shortUrl: 1 , urlCode: 1 , _id: 0})

        if (url) {
            res.status(200).send({status: true ,  data: url})
        }

        else {
            const shortUrl = baseUrl + '/' + urlCode

            data['shortUrl'] = shortUrl
            data['urlCode'] = urlCode
    
            const urlData = await URLModel.create(data)
            await SET_ASYNC(`${urlData}`, JSON.stringify(urlData))
            return res.status(201).send({status: true , data: urlData })
        }

    }
    catch (error){
        console.log(error)
        res.status(500).send({status: false , message: error.message})
    }
}

const redirection = async (req , res) => {
    try {
      const query = req.query
        if (Object.keys(query) != 0) {
            return res.status(400).send({status: false , message: "Invalid params present in URL"})
        }
    const { urlCode } = req.params
   
      let cahcedUrlData = await GET_ASYNC(`${urlCode}`)
      let data = JSON.parse(cahcedUrlData)

      if(cahcedUrlData) {
        res.status(302).redirect(data.longUrl)
      }

      else {
      const url = await URLModel.findOne({
          urlCode: urlCode
      })
      if (!url) {
        return res.status(404).send({status: false , message: "No URL found" })
     }
     else {
         return res.status(302).redirect(url.longUrl)
      }
    }
    }
    catch (error){
        console.log(error)
        res.status(500).send({status: false , message: error.message})
    }
}


module.exports = {
    URLshorten ,
    redirection
}