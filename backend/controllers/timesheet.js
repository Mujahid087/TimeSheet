const User=require('../models/User') 
const TimeSheet=require('../models/timesheet')
const asyncHandler=require('../middlewares/asyncHandler') 
const ErrorResponse=require('../utils/errorReponse') 
const isValidObjectId=require('../models/validateObjectId') 


module.exports.createTimeSheet=asyncHandler(async(req,res,next)=>{
    const timeSheetPayload={...req.body} 
    const employee=timeSheetPayload.employee 

    if(!employee || !isValidObjectId(employee)){
        return next(new ErrorResponse(400,'Invalid employee id'))
    } 

    const user=await User.findById(employee) 
    if(!user){
        const message='Employee not found for the provided id'; 
        return next(new ErrorResponse(404,message))
    }

    const timeSheet=new TimeSheet(timeSheetPayload) 
    await timeSheet.save() 

    res.status(201).json({
        success:true, 
        status:201, 
        ...timeSheet._doc
    })
}) 

module.exports.rateTimeSheet=asyncHandler(async(req,res)=>{
    let {rating,employee}={...req.body} 
    const timeSheetId=req.params.id; 
    const manager=req.user 

    if(!rating && rating!==0){
        return next(new ErrorResponse(400,'please provide a rating'))
    }

    if(rating<0 || rating>5){
        return next(new ErrorResponse(400,'Rating out of range! Allowed 0-5'))
    }

    if(!isValidObjectId(timeSheetId)){
        return next(new ErrorResponse(400,'Timesheet id is not a valid id'))
    }

    if(!manager.isManager){
        const message="you cannot rate as you are not a manager"; 
        return next(new ErrorResponse(401,message))
    }

    if(!isValidObjectId(employee)){
        return next(new ErrorResponse(400,'Employee id is not a valid id!'))
    }

    employee=await User.findById(employee) 
    if(!employee) {
        return next(new ErrorResponse(404,'Employee with provided id not found!'))
    }
    
    if(!manager._id.equals(employee.reportsTo)){
        return res.status(400).json({
            success:false, 
            message:"you are not the manager of this employee"
        })
    } 

    const timeSheet=await TimeSheet.findById(timeSheetId) 

    if(!timeSheet) return next(new ErrorResponse(404,'timesheet not found')) 
    if(timeSheet.rating || timeSheet.rating ===0){
        return next(new ErrorResponse(400,'you have already rated this timesheet!'))
    }


     timeSheet.rating = rating;
  await timeSheet.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Rating operation successful',
    data: {
      rating,
    },
  });





})