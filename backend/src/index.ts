import "dotenv/config"
import app from "./app"
import connectDB from "./db/db";


const port = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(port || 8000, () => {
            console.log(`server is up and running at ${process.env.PORT}`)
        })
        
    })
    .catch((error) => {
        console.log("MONGODB connection Failed")
    })
