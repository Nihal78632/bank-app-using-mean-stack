//importing express
const express = require('express')
//importing cors
const cors= require('cors')
//importing logic 
const logic =require('./services/logic')
//importing jsonwebtoken
const jwt=require('jsonwebtoken')


//making a server
const server = express()

//using cors
server.use(cors({
    origin:'http://localhost:4200',
}))

//to parse json data
server.use(express.json())






//setuping portnumber

server.listen(3000,()=>{console.log("bank app started on 3000");})

//middlware
const jwtmiddleware=(req,resp,next)=>{
    //getting token from req header
    const token=req.headers['verify-token']
   

  try{  const data=jwt.verify(token,'hellohi12345')

  req.currentacno=data.loginaccno
  next()


}catch{
    resp.status(401).json({message:"Please login"})
}

    
}

//register api

server.post("/register",(req,resp)=>{
    console.log("inside register");
   

//logic for registering
logic.register(req.body.acno,req.body.password,req.body.username).then((result)=>
{
    resp.status(result.statusCode).json(result)
})


//response sent to client
 
}) 

//login api
server.post("/login",(req,resp)=>{
    console.log("inside login");
    logic.login(req.body.username,req.body.password).then((result)=>{

        resp.status(result.statusCode).json(result)
    })

})

//balance enquiry
server.get("/get-balance/:acno",jwtmiddleware,(req,resp)=>{
    
  
    logic.getbalance(req.params.acno).then((result)=>{

        resp.status(result.statusCode).json(result)
    })

})

//fund transfer
server.post("/fund-transfer",jwtmiddleware,(req,resp)=>{
    console.log("inside login");
    logic.fundtransfer(req.currentacno,req.body.pswd,req.body.toacno,req.body.amt).then((result)=>{

        resp.status(result.statusCode).json(result)
    })

})

//transaction
server.get("/transaction",jwtmiddleware,(req,resp)=>{
    
  
    logic.transaction(req.currentacno).then((result)=>{

        resp.status(result.statusCode).json(result)
    })

})

//deleting account
server.get("/deleteaccount",jwtmiddleware,(req,resp)=>{
    console.log("inside delete");
    logic.deleteaccount(req.currentacno).then((result)=>{

        resp.status(result.statusCode).json(result)
    })

})



 
