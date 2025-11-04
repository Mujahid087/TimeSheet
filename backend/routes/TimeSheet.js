const express=require("express") 
const router=express.Router(); 
const protect=require("../middlewares/protect")
const admin=require("../middlewares/admin")
const {createTimeSheet}=require("../controllers/timesheet")


router.post("/timesheet",protect,admin,createTimeSheet)

module.exports=router