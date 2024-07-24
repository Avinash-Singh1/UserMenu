const mongoose = require('mongoose');
const connectDB = async()=> {

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI,{dbName: "backend",})
    // const conn = await mongoose.connect("mongodb://127.0.0.1:27017", {
    //   dbName: "backend",
    // })
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));
    // console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}



module.exports = connectDB;

