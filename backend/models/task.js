const mongoose=require("mongoose") 
const {Schema}=mongoose 


const taskSchema=new Schema({
    timesheet:{
        type:Schema.Types.ObjectId, 
        ref:'TimeSheet',
        required:[true , 'TimeSheet is required for this task!'],
    }, 
    hour:{
        type:Number, 
        min:0,
        max:23, 
        required:[true,'please provide hour value'],
    }, 
    minute:{
        type:Number, 
        min:0,
        max:59, 
        default:0
    }, 
    description:{
        type:String, 
        minLength:2, 
        maxLength:2048, 
        trim:true, 
        required:[true,'Description is required']
    }, 
    remarks:{
        type:String,
        minLength:2, 
        maxLength:2048, 
        trim:true, 
        required:[true,'remarks cannot be empty!'] 

    },
}, {timestamps:true})

const Task=mongoose.model('Task',taskSchema) 
module.exports=Task