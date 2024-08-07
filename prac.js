const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtPassword = "123456";
const zod = require('zod');
const app = express();
//Body Reading
app.use(express.json()); 

// Mongo Connection
mongoose.connect('mongodb+srv://kundan:KUNDANgasly10*@cluster0.uxlratl.mongodb.net/user_app');
// Mongo model
let User = mongoose.model("users",{
    name : String,
    password : String,
    email : String
});

//schemas
const schema = zod.string();
const schema_email = zod.string().email();

function user_input_validation_middleware(req,res,next)
{
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let response1 = schema.safeParse(username);
    let response2 = schema.safeParse(password);
    let response3 = schema_email.safeParse(email);
    if(!(response1 && response2 && response3))
    {
        res.status(403).send("Incorrect Body datatypes");
    }
    else
    {
        next();
    }
}
// User Input Validation
app.use(user_input_validation_middleware);
// Rate Limiting 
app.use(function(req,res,next){
    setInterval(()=>{
        numberOfRequestsUser = {};
    },1000);
    let user = req.body.username;
    if(numberOfRequestsUser[user])
    {
        numberOfRequestsUser[user]+=1;
        if(numberOfRequestsUser[user]>5)
        {
            res.status(404).json({msg:"Banned! Too many Requests!"});
        }
    }
    else
    {
        numberOfRequestsUser[user]=1;
    }
    next();
})
// Sigining Up
app.post("/signup",function(req,res){
    let username = req.body.username;
    let passwords = req.body.password;
    let emails = req.body.email;
    const user = new User({
        name : username,
        password : passwords,
        email : emails
    })
    user.save();
})
// Sigining In
app.get("/signin",function(req,res){
    let username = req.body.username;
    let token  = jwt.sign({ username : username },jwtPassword);
    res.json({
        msg: "User-Verified",
        token: token
    })
})
// Token verification
app.get("/token",function(req,res){
    let token = req.headers.token;
    try
    {
        let decode = jwt.verify(token,jwtPassword);
        let username = decode.username;
        res.json({
            token_verification_status: "Verfied",
            msg: "Welcome Back!"+username
        })
    }
    catch(err)
    {
        res.status(403).json({msg:"Invalid Token"});
    }
})

// Global catch
app.use(function(req,res,next,err){
    res.status(403).send("Whoops! Something went Wrong!");
})

app.listen(3000);