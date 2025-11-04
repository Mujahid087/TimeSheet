const mongoose=require("mongoose") 

const connectDB=async()=>{
    const URI=process.env.DB_CONNECTION_STRING;
    const options={
        useNewUrlParser:true,
        useUnifiedTopology:true,
       
    }

    try {
        mongoose.set('strictQuery',true) 
        await mongoose.connect(URI,options)
        console.log("successfully connected to database")
    } catch (error) {
        console.log('connection to database failed!',error)
        
    }
}

module.exports=connectDB