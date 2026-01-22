import mongoose from 'mongoose' 
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to Database: ${conn.connection.host}`)
    } catch(error) {
        console.error(`Connection Error: ${erreo.message}`)
        process.exit(1)
    }
} 
export default connectDB