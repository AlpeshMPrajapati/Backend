const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer', 
    }
})

module.exports = mongoose.model('User',userSchema);
