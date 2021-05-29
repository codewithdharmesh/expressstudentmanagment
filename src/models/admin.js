require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const createSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});


createSchema.methods.genratetoken = async function(){
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.secretkey);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;


    } catch (error) {
        res.send(`the error is ${error}`);
        console.log(error);
    }
}

createSchema.pre("save", async function(next){

    // if is used only when tha password is updated of register on when password is hashed
    if(this.isModified("password")){
        
        this.password = await bcrypt.hash(this.password,10);
                 
        this.confirmpassword = await bcrypt.hash(this.password,10);
        
    }
next();

})

createSchema.methods.genratetoken = async function(){
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.secretkey);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;


    } catch (error) {
        // res.send(`the error is ${error}`);
        console.log(error);
    }
}

const Admin = new mongoose.model("Admin",createSchema);
module.exports = Admin;