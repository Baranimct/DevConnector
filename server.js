const express = require('express');
const connectDB = require('./config/db');
const app=express();

app.get('/',(req,res) => res.send('API Running Test'));

//Calling DB connection
connectDB();

const PORT=process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started on Port "+PORT));
