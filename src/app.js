require('dotenv').config();
const express = require("express");
const { registerPartials } = require("hbs");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const axios = require("axios");

require("./db/conn");
const Auth = require("./middleware/auth");
const Student = require("./models/student");
const Admin = require("./models/admin");
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


const viewpath = (path.join(__dirname,"../template/views"));
const partialspath = (path.join(__dirname,"../template/partials"));

app.set('view engine','hbs');
app.set("views",viewpath );
hbs.registerPartials(partialspath)


//home page
app.get("/",(req,res) => {
res.render('index');

});


app.get("/userpanel",Auth,async(req,res) => {
   try {
    // axios.get('http://localhost:3000/userdata').then((response) => {
    //     console.log(response);
    //     res.render('userpanel',{users:response.data});
    // })   
    const users = await Student.find({});
    res.render('userpanel',{users:users});

   } catch (error) {
      console.log(error); 
   }
    
});




app.get("/userinsert",Auth,(req,res)=>{
    res.render('userinsert');
})
app.post("/userinsert", async(req,res) => {
    try {
        const user = new Student({
            name: req.body.name,
            studentid:req.body.studentid,
            class:req.body.class

        })
        const result = await user.save();
        // console.log(result);
        res.render('userpanel');
    } catch (error) {
        console.log(error);
        
}
})





// LOGIN    ***    LOGIN
app.get("/login",(req,res) => {
    res.render('login');
});
app.post("/login",async (req,res) =>{

    console
    try {
        const email = req.body.email;
        const password = req.body.password;
        const result = await Admin.findOne({email:email}); 
        const hash = await bcrypt.compare(password,result.password);
        const token = await result.genratetoken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now() +900000),
            httpOnly:true
        });

        if(hash){
            res.render('index',{
                user:result.name,
            });
        }
        else{ 
            res.send("invalid login details");
        }
        
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


// RIGISTER *** REGIRSTER 
app.get("/register",async(req,res)=>{
    res.render('register');

})
// create of new data from form
app.post("/register", async (req,res)=>{
    try {
         const password = req.body.password;
         const cpassword = req.body.confirmpassword;
     
         if(password === cpassword){
             
             
             const data = new Admin({
                 
                 name:req.body.name,
                 email:req.body.email,
                 password:req.body.password,
                 confirmpassword:req.body.confirmpassword
                 
             })
 
            
 // tokens and cookies are used to authtication of user 
             const token = await data.genratetoken();
            
             // storing this cookies 
             // res.cookie(name,datastore,options)
             res.cookie("jwt",token,{
                 expires:new Date(Date.now() +900000),
                 httpOnly:true
             });
 
 
             const result = await data.save();
             // console.log(result);
             res.render('index',{
                user:result.name,
            });
 
 
         }else{
             res.send("password is not matching");
         }
         
    } catch (error) {
        res.status(400).send(error);
    } 
 }); 



//  ****   LOGOUT *** LOGOUT
app.get("/logout",Auth, async(req,res)=>{

    try {
        // for single user logout
        // req.user.tokens = req.user.tokens.filter((currElement) =>
        // {
        //     return currElement.token !== req.token
        // })

        // for all user logout
        req.user.tokens = [];
         res.clearCookie("jwt");
        console.log("logut successfully");

        await req.user.save();
        res.render('login');

    } catch (error) {
        res.status(500).send(error);
          }

});



app.listen(port,(err)=>{
    console.log(`listning to the port no: ${port}`);
    
});
