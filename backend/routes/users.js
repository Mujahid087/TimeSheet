const express=require('express') 
const router=express.Router() 
const {createUser, updateUser}=require('../controllers/users') 
const protect=require('../middlewares/protect') 
const admin=require('../middlewares/admin') 

router.post('/create-user',protect,admin,createUser) 
router.post('/update/:id',protect,admin,updateUser)

module.exports=router