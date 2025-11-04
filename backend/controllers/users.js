const User=require('../models/User')
const asyncHandler=require('../middlewares/asyncHandler') 
const Role=require('../models/role') 
const ErrorResponse = require('../utils/errorReponse')
const isValidObjectId=require("../models/validateObjectId")

/* 
* @route /ceate-user 
* method Post 
* @access admin 
* @desc cerate a user in a db
*/ 

// module.exports.createUser=asyncHandler(async(req,res , next)=>{
//     const userPayload={...req.body} 

//     const userExists=await User.findOne({email:userPayload.email}) 
//     if(userExists){
//         const message='user is already registeres with this email';
//         return next(new ErrorResponse(400,message))
//     }


//     const roleId=await Role.findOne({roleId:userPayload.role});

//     if(!roleId){
//         return next(new ErrorResponse(400,'provide valid role for user'))

//     }

//     userPayload.role=roleId._id 

//     // if(userPayload.reportsTo && !isValidObjectId(userPayload.reportsTo)){
//     //     return next(new ErrorResponse(400,'provide valid reporting manager'))
//     // }
    
//     const manager=await User.findById(userPayload.reportsTo).populate('role')

//     if(userPayload.manager && !manager){
//         const message='Manager not found with the given id!'; 
//         return next(new ErrorResponse(400,message))
//     }

//     if(userPayload.reportsTo && manager.role.roleId!==1){
//         const message='The id you gave for the manager is not an id of a manage!'
//         return next(new ErrorResponse(400,message))
//     }

//     const user=new User(userPayload) 
//     await user.save() 

//     const token=user.generateAuthToken(); 
//     const userData={...user._doc} 
//     delete userData.password ; 

//     res.header('x-auth-token',token).json({
//         success:true,
//         status:200, 
//         token,
//         user:userData
//     })
// }) 


module.exports.createUser = asyncHandler(async(req, res, next) => {
    const userPayload = {...req.body} 

    const userExists = await User.findOne({email: userPayload.email}) 
    if(userExists) {
        const message = 'User is already registered with this email';
        return next(new ErrorResponse(400, message))
    }

    const roleId = await Role.findOne({roleId: userPayload.role});

    if(!roleId) {
        return next(new ErrorResponse(400, 'Provide valid role for user'))
    }

    userPayload.role = roleId._id 

    // Only validate and fetch manager if reportsTo is provided
    if(userPayload.reportsTo) {
        if(!isValidObjectId(userPayload.reportsTo)) {
            return next(new ErrorResponse(400, 'Provide valid reporting manager ID'))
        }
        
        const manager = await User.findById(userPayload.reportsTo).populate('role')

        if(!manager) {
            const message = 'Manager not found with the given ID'; 
            return next(new ErrorResponse(400, message))
        }

        if(manager.role.roleId !== 1) {
            const message = 'The ID you provided is not for a manager role'
            return next(new ErrorResponse(400, message))
        }
    }

    const user = new User(userPayload) 
    await user.save() 

    const token = user.generateAuthToken(); 
    const userData = {...user._doc} 
    delete userData.password; 

    res.header('x-auth-token', token).json({
        success: true,
        status: 200, 
        token,
        user: userData
    })
})