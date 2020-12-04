var express = require('express');

var mysql = require('mysql');

var bodyparser = require('body-parser');

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: 'giftbucket'
});

var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.post('/signup/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var password = data.password;

    connection.query("SELECT * FROM register_user WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });

        if(result && result.length){
            res.json("User Already Exists");
        }
        else{
            var insert = "INSERT INTO register_user (name,email,password) values(?,?,?)";
            var values = [name,email,password];

            console.log("executing: "+insert);
            connection.query(insert,values,(err,result,fields)=>{
                connection.on('error',(err)=>{
                    console.log("[MYSQL ERROR]",err);
            });
            res.json("Registered");
            console.log("Registration Successful");
        });
        }
    });
});

app.post("/loginuser/",(req,res,next)=>{
    var data = req.body;
    var email = data.email;
    var password = data.password;

    connection.query("SELECT * FROM register_user WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });
            
        if(result && result.length){
            console.log(result);

            if(password==result[0].password){
                res.json("User Logged in Successfully");
                res.end;
            }else{
                res.json("Wrong Password");
                res.end;
            }
        }else{
            res.json("User not found");
            res.end;
        }
    });    
});

app.post('/profile/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var address = data.address;
    var city = data.city;
    var province = data.province;
    var country = data.country;
    var postalcode = data.postalcode;

    connection.query("SELECT * FROM user_profile WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });

        if(result && result.length){
            res.json("Profile data for this User already Exists......");
        }
        else{
            var insert = "INSERT INTO user_profile (name,email,phone,address,city,province,country,postalcode) values(?,?,?,?,?,?,?,?)";
            var values = [name,email,phone,address,city,province,country,postalcode];

            console.log("executing: "+insert);
            connection.query(insert,values,(err,result,fields)=>{
                connection.on('error',(err)=>{
                    console.log("[MYSQL ERROR]",err);
            });
            res.json(name+"'s profile data has been saved successfully");
            console.log("Profile data saved Successfully");
        });
        }
    });
});



var server = app.listen(3000,()=>{
    console.log("Server Running at http://localhost:3000");
});