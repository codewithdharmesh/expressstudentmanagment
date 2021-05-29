const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    studentid:{
        type: String,
        required: true
    },
    class:{
        type: Number,
        required: true
    },

})

const Student = new mongoose.model("student",createSchema);

module.exports = Student;