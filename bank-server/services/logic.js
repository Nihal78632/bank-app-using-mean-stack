//importing json web token
const jwt=require('jsonwebtoken')
//importing db

const db= require('./db')
//register
const register=(acno,password,username)=>{

    //logic to resolve register(acno,username,password)
    console.log('inside logic');

    //check acno in db
   return db.User.findOne({
        acno
    

    }).then((response)=>{
        console.log(response);
        if(response){
            //already exist
            return{
                statusCode:401,
                message:"Account already exist..."
            }
        }
        else{
            //acno is not present
           
            const newuser=new db.User({
                acno,
                password,
                username,
                balance:5000,
                transactions:[]
            })

            //to store the newuser in mongodb
            newuser.save()
            //to tell response to client
            return{
                statusCode:200,
                message:"Successfully registered",
              

            }
        }
    })
    //if present already exist
    //if not present ,insert data

}

const login=(username,password)=>{
    console.log('inside login')
    // checking if username and password is in db

    return db.User.findOne({
        username,
        password
        
    }).then((result)=>{
        if(result){
            //present in db
             //generating token
             const token=jwt.sign(
                {
                    loginaccno:result.acno
                },'hellohi12345'
            )
            return {
                statusCode:200,
                message:'login Successful',
                  //sending token to client
                  token,
                  username:result.username,
                  acno:result.acno
            }
        }
        else{
            return {
                statusCode:404,
                message:'Invalid username or password'
            }
        }
    })

}

//balance
getbalance=(acno)=>{

    return db.User.findOne({
        acno
    }).then((response)=>{

        if(response){
            return{
                statusCode:200,
                message:"Account is present",
                balance:response.balance,
                name:response.username
            }
        }
        else{
            return{
                statusCode:404,
                message:"Account is not present"

            }
        }
    })

}

//fund transfer

fundtransfer=(fromAcno,Frompswd,toAcno,amt)=>{
    //converting amount to int
    let amount=parseInt(amt)

    //validation of from acnt
    return db.User.findOne({
        acno:fromAcno,
        password:Frompswd
    }).then((debit)=>{
        //if validation successful

        if(debit){

            //checking if toacno exists

            return db.User.findOne({
                acno:toAcno
            }).then((credit)=>{
                //if Credit account exist

                if(credit){
                  if(fromAcno!=toAcno){ if( debit.balance>=amount){
                    //doing transaction
                    debit.balance-=amount
                    //marking in transaction
                    debit.transactions.push({
                        type:"Debit",
                        amount,
                        fromAcno,
                        toAcno,
                        balance:debit.balance
                    })
                    // to save changes in mongodb
                    debit.save()

                    //transaction in to account
                    credit.balance+=amount
                    //marking in transaction
                    credit.transactions.push({
                        type:"Credit",
                        amount,
                        fromAcno,
                        toAcno,
                        balance:credit.balance
                    })
                    //to save changes in mongodb
                    credit.save()
                    return{
                        statusCode:200,
                        message:"Transaction Successful"
                    }

                   }
                   else{
                    return{
                        statusCode:404,
                        message:"Insufficient Balance"
                    }

                   }
}
else{
    return{
        statusCode:404,
        message:"Transaction Invalid"
    }
    
}

                }
                else{
                    return{
                        statusCode:404,
                        message:"Debit account is invalid"
                    }
                }
            })

        }

        //validation not successful
        else{
            return{
                statusCode:404,
                message:"Invalid credentials"
            }
        }
    })



}

//transaction

transaction=(acno)=>{

    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                message:"successful",
                transactions:result.transactions
            }
        }else{
            return{
                statusCode:404,
                message:"no account"
            }
        }
    })

}

//deleting account
deleteaccount=(acno)=>{
    //checking acno
    return db.User.deleteOne({
        acno
    }).then((result)=>{
       return{
        statusCode:200,
        message:"deletion successful"
       }
    })

}
//export
module.exports={
    register,
    login,
    getbalance,
    fundtransfer,
    transaction,
    deleteaccount
}