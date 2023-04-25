//database connection


//importing mongoose
const mongoose=require("mongoose")

//using mongoose,definbe connection between mongodb and express
mongoose.connect('mongodb://localhost:27017/Bank')

//create a mo0del/scheme for storing data
const User=mongoose.model("User",{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transactions:[]


})

//exporting the data
module.exports={
    User
}