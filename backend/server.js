const express=require("express") 
const morgan=require("morgan") 
const cors=require("cors") 
const dotenv=require("dotenv") 
const connectDB=require('./config/db')
const userRoutes=require('./routes/users')
const roleRoutes=require('./routes/roles')
const authRoutes=require('./routes/auth')
const timesheetRoutes=require("./routes/TimeSheet")


const server=express() 
dotenv.config() 
server.use(morgan('tiny')) 
server.use(express.json()) 
server.use(cors({
    credentials:true,
    origin:'*'
}))
connectDB() 

const BASE_PREFIX=process.env.BASE_PREFIX 

server.use(BASE_PREFIX,userRoutes)
server.use(BASE_PREFIX,roleRoutes)
server.use(BASE_PREFIX,authRoutes) 
server.use(BASE_PREFIX,timesheetRoutes)


const PORT=process.env.PORT || 8000; 
server.listen(PORT,()=>{
    console.log(`PORT:${PORT} | The server is up and running`)
})
