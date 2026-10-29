// Start Server
const express = require('express');
const dotenv = require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./src/app');
const connectDB = require('./src/Db/db.js')

connectDB();

app.listen(3000, () =>{
    console.log('Server Started at Port', 3000);
    
});