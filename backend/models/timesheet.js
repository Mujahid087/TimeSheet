const mongoose=require("mongoose") 
const {Schema}=mongoose 
const {ObjectId}=mongoose.Types 

const timesheetSchema=new Schema({
    projectName:{
        type:String,
        minLength:2, 
        maxLength:64, 
        trim:true, 
        required:[true,"Project name cannot be empty!"]
    },
    date:{
        type:Date, 
        required:[true,'Date is required for timeSheet']
    }, 
    tasks:{
        type:[ObjectId], 
        ref:'Task', 
        default:[],
    },
    employee:{
        type:ObjectId, 
        ref:'User', 
        required:[true,'Employee for the timesheet is required!'],
    },
    rating:{
        type:Number,
        min:0, 
        max:5,
    }
},{timestamps:true}) 


const TimeSheet=mongoose.model('TimeSheet',timesheetSchema) 
module.exports=TimeSheet