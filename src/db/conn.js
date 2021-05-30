const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/student",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,

    

}).then(()=>{
    console.log("connet with database");

}).catch((err)=>{
   
});