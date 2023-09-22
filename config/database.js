const mongoose = require('mongoose');
require('dotenv').config();

const Connect = ()=>{
    mongoose.connect(process.env.URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{console.log("DB is Connected Successfully !")})
    .catch((err)=>{
        console.error("Error : ",err.message)
        process.exit(1);
    })
}

module.exports = Connect;