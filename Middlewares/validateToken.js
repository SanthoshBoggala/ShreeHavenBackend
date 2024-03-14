require('dotenv').config();

const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');


const validateToken = asyncHandler(async(req, res, next)=>{

    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    
    if(!authorizationHeader || !authorizationHeader.startsWith('Bearer ')){
        
        res.status(401);
        throw new Error("Invalid Token / Unauthorized");
    }

    const token = authorizationHeader.split(' ')[1];

    try{
        
        const decoded = await jwt.verify(token, process.env.JWT_ACCESSCODE);

        req.user = decoded;

        next();
    }
    catch(err){
        res.status(401);
        throw new Error("JWT err:", err); 
    }

})

module.exports = validateToken;