const Role=require('../models/role') 
const asyncHandler=require('../middlewares/asyncHandler') 

module.exports.createRole=asyncHandler(async (req,res,next)=>{
    const rolePayload={...req.body} 

    const role=new Role(rolePayload) 
    await role.save() 

    res.json({
        status:201, 
        message:'the role has been created'. 
        role,
    })
})