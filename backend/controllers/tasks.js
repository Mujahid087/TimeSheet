const TimeSheet=require("../models/timesheet") 
const Task=require("../models/task") 
const asyncHandler=require("../middlewares/asyncHandler") 
const ErrorResponse=require("../utils/errorReponse") 
const isValidObjectId=require("../models/validateObjectId")


/*
 * @route   /task
 * @method  POST
 * @access  Protected
 * @desc    Add a task in a timesheet.
 */ 

module.exports.addTask=asyncHandler(async(req,res,next)=>{
    const taskPayload={...req.body} 
    const employeeId=req.user._id; 
    const timesheetId=taskPayload.timesheet; 
    
    if(!isValidObjectId(timesheetId)){
        return next(new ErrorResponse(400,'invalid timesheet Id!'))
    }

    const timesheet=await TimeSheet.findById(timesheetId)

    if(!timesheet){
        return next(new ErrorResponse(404,'timesheet did not found!'))
    }

    if(!timesheet.employee.equals(employeeId)){
        const message='you can not add tasks to this timesheet!'
        return next(new ErrorResponse(403,message))
    }

    if(timesheet.rating || timesheet.rating === 0){
        const message='can not add to timesheet once it had been rated!'
        return next(new ErrorResponse(400,message))
    }

    const task=new Task(taskPayload);
    await task.save(); 

    await TimeSheet.findByIdAndUpdate(timesheetId,{
        $push:{tasks:task._id},
    })

    res.status(201).json({
        success:true,
        status:201, 
        message:'Task addedd successfully!', 
        ...task._doc
    })    
})