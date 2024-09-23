const mongoose = require('mongoose');
 
const connectDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://tkm9:Fhyw6E@mydbcluster.m9x3e.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=mydbcluster');
        console.log("database connected...");
        return { success: true, message: "db connected" };
    } catch (error) {
        console.log("connectDatabase catch >> ", error);
        return { success: false, message: error.message };
    }
}

module.exports = { connectDatabase };
