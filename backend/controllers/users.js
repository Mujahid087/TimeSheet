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


module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updates = { ...req.body };

  // 1️⃣ Check if the user exists
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return next(new ErrorResponse(404, 'User not found'));
  }

  // 2️⃣ If email is being updated, ensure it's unique
  if (updates.email && updates.email !== existingUser.email) {
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists) {
      return next(new ErrorResponse(400, 'Email already in use by another user'));
    }
  }

  // 3️⃣ Validate role if provided
  if (updates.role) {
    const roleDoc = await Role.findOne({ roleId: updates.role });
    if (!roleDoc) {
      return next(new ErrorResponse(400, 'Invalid role ID provided'));
    }
    updates.role = roleDoc._id;
  }

  // 4️⃣ Validate and verify reporting manager if provided
  if (updates.reportsTo) {
    if (!isValidObjectId(updates.reportsTo)) {
      return next(new ErrorResponse(400, 'Invalid reporting manager ID'));
    }

    const manager = await User.findById(updates.reportsTo).populate('role');

    if (!manager) {
      return next(new ErrorResponse(400, 'Manager not found with the given ID'));
    }

    if (manager.role.roleId !== 1) {
      return next(new ErrorResponse(400, 'Provided user is not a manager'));
    }
  }

  // 5️⃣ Update user fields
  Object.keys(updates).forEach((key) => {
    existingUser[key] = updates[key];
  });

  // 6️⃣ Save the updated user
  const updatedUser = await existingUser.save();

  const userData = { ...updatedUser._doc };
  delete userData.password;

  // 7️⃣ Send response
  res.status(200).json({
    success: true,
    status: 200,
    message: 'User updated successfully',
    user: userData,
  });
});