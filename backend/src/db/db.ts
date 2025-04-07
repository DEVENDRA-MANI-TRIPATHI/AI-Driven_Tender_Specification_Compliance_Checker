import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(` mongoDB connected at host name: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Database connection Error",error)
    }
}

export default connectDB;