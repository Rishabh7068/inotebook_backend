const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://r123ishabh:4XKk96IKPPJbQBVu@cluster.rdb7zyd.mongodb.net/inotenook";


const connectToMongo = async () =>{
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to mongo successfully");
    } catch (error) {
        console.log(error);
    }
} 

module.exports = connectToMongo;
