var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    passord:"",
    database: 'giftbucketdb'
});

var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.post('/register/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var password = data.password;

    connection.query("SELECT * FROM user_info WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            connection.log("[MYSQL ERROR]",err);
        });

        if(result && result.length){
            res.json("User Already exists");
        }
        else{
            var insert = "INSERT INTO user_info (name,email,password) values(?,?,?)";
            var value =[name,email,password];

            console.log("executing:"+insert);
            connection.query(insert,value,(err,result,fields)=>{
                connection.on('error',(err)=>{
                    connection.log("[MYSQL ERROR]",err);
                });
                res.json("Registered");
                console.log("Resgistration successfull");
            });
        }
    });
});

app.post('/login/',(req,res,next)=>{

    var data = req.body;
    var email = data.email;
    var password = data.password;

    connection.query("SELECT * FROM user_info WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            connection.log("[MYSQL ERROR]",err);
        });

        if(result && result.length){
          console.log(result);

          if(password==result[0].password){
              res.json("User logged in successfully");
              res.end;
          }
          else{
            res.json("Wrong password");
            res.end;  
          }
        }
        else{
            res.json("User not found");
              res.end;
        }
    });
});



app.post('/feedback/',(req,res,next)=>{

    var data = req.body;
    var name = data.name;
    var email = data.email;
    var phone = data.phone;
    var producttype = data.producttype;
    var feedback = data.feedback;

    var insert = "INSERT INTO user_feedback (name,email,phone,producttype,feedback) values(?,?,?,?,?)";
    var value = [name,email,phone,producttype,feedback];

    console.log("executing:"+insert);
    connection.query(insert,value,(err,result,fields)=>{
        connection.on('error',(err)=>{
            console.log("[MYSQL ERROR]",err);
        });
        
    
    res.json("Your Feedback Submitted Successfully");
    console.log("Feedback Saved");
     });
});
var server = app.listen(3000,()=>{
    console.log("Server Running at http://localhost:3000");
});