const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");


const auth = async (req,res,next) =>{

    try {

    const token = req.cookies.jwt;
    const verify = jwt.verify(token,process.env.secretkey);
    // console.log(verify);

    const user =await Admin.findOne({_id:verify._id});
    // console.log(user.firstname);    

    req.token = token;
    req.user = user;
    next();

    } catch (error) {
    res.status(401).send(error);    
    }


}

module.exports = auth;