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

module.exports.getMyTimeSheets=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id; 

    const timesheets=await TimeSheet.find({employee:userId})
    .populate({path:'employee',select:'name email'}) 
    .sort({date:'desc',rating:'asc'})

    res.json({
        success:true,
        status:200, 
        timesheets
    })
})

module.exports.findMyTimesheets=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id; 
    let {startDate,endDate}={...req.body}; 

    if(!startDate || !endDate){
        const message='Start and end date,both are required'; 
        return next(new ErrorResponse(400,message))
    }

    const timeSheets=await TimeSheet.find({
        employee:userId, 
        date:{
            $gte:startDate,
            $lte:endDate,
        }
    })
    .populate({path:'employee',select:'name email'})
    .sort({date:'desc',rating:'asc'})

    res.json({
        success:true, 
        status:200,
        timeSheets
    })

})


module.exports.getTimeSheet=asyncHandler(async(req,res)=>{
    const user=req.user; 
    const timesheetId=req.params.id; 

    const timesheet=await TimeSheet.findById(timesheetId) 
    .populate({path:'employee',select:'name email reportsTo'})
    .populate('tasks') 

    if(!timesheet) return next (new ErrorResponse(404,'Timesheet not found!')) 

     const isAdmin=user.role.roleId === 0 ; 

     const timesheetBelongsToCurrentUser=timesheet.employee._id.equals(user._id); 

     if(!timesheetBelongsToCurrentUser && !isAdmin){
        const isReportingManager=timesheet.employee.reportsTo?.equals(user._id) 
        if(!isReportingManager){
            return next(new ErrorResponse(403,'you can not have this information'))
        }
     }

     const tasks=timesheet.tasks.sort((a,b)=>{
        if(a.hour<b.hour) return -1; 
        else if(b.hour < a.hour) return 1 ; 
        else if(a.minute < b.minute) return -1; 
        else return 0;

     })

     res.json({
        success:true,
        status:200,
        timesheet:{...timesheet._doc,tasks},
     })
}) 

module.exports.getEmployeesTimesheets = asyncHandler(async (req, res, next) => {
  const managerId = req.user._id;

  const employees = await User.find({ reportsTo: managerId }).select('name');

  if (!employees || !employees.length) {
    const message =
      'You do not have employees working under you. Hence no timesheets.';
    return next(new ErrorResponse(404, message));
  }

  const timesheets = await Promise.all(
    employees.map(async (employee) => {
      const timesheet = await TimeSheet.find({
        employee: employee._id,
      }).populate({ path: 'employee', select: 'name email role' });

      return timesheet;
    })
  );

  let timesheetsArr = [];
  timesheets.forEach((userTimesheets) => {
    userTimesheets.forEach((timesheet) => {
      timesheetsArr.push(timesheet);
    });
  });

  res.json({
    success: true,
    status: 200,
    timesheets: timesheetsArr,
  });
});