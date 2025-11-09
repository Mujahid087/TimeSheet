const mongoose=require('mongoose')
const ErrorResponse=require('../utils/errorReponse') 
const isValidObjectId=require("../models/validateObjectId") 

const verifyId=(idToVerify)=>(req,res,next)=>{
    const id=req.params[idToVerify] 
    if(!isValidObjectId(id)){
        return next (new ErrorResponse(400,`"${id}" is not a valid id!`))

        next() 
    }
}

module.exports=verifyId