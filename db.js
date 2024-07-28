require('dotenv').config();
const mongoose = require('mongoose');
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
