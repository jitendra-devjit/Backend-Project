import 'dotenv/config'
import connectDB from "./db/index.js";
import {app} from "./app.js";

connectDB()
.then(() =>{
    app.on("error", (error) => {
        console.error("Express error:", error);
        throw error;
    });
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
});























// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.error("Express error:", error);
//             throw error;
//         });
        
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     } 
// })();