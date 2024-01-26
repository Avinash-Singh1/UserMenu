const mongoose = require('mongoose');
const connectDB = async()=> {
  // const  connectionString= `mongodb+srv://avinash:avinash123@cluster0.4c8ksxp.mongodb.net/next?retryWrites=true&w=majority`;
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}



module.exports = connectDB;

