
const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.dbhost;

const connectToMongo = async () =>{
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongo successfully");
    } catch (error) {
        console.log(error);
    }
} 

module.exports = connectToMongo;
