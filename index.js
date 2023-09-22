const express = require('express');
const Connect = require('./config/database');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 8000;
const cors = require('cors')

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
  }))

//DB Connection
Connect();

//import and mount routes

const user = require('./routes/user')
const loan = require('./routes/loan')
const repayment = require('./routes/repayment')

app.use('/api/v1',user);
app.use('/api/v1',loan);
app.use('/api/v1',repayment);



app.listen(Port,()=>{
    console.log(`Server is running on Port no. ${Port}`)
})

