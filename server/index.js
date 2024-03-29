// importing statment so we can install our packages  
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// CONFIGURATIONS (Contains all the middle wear configurations), Middleware - basically functions that run in between different things

// This configuration is so we can grab the file URL specifically with modules so can grab directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // <- this only when you use type modules
dotenv.config(); // <- invoke dotenv so we can use dot EMV files 
const app = express(); // <-invoke express application so we can use our middleware
app.use(express.json()); // <- invoke express.json()
app.use(helmet()); // <- invoke helmet()
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"})); 
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true })); // 30mb so we don't have any issues 
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());  // <- invoke our cross origin resource sharing policies 
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // set directory of where we keep our assets(images that we store)


// FILE STORAGE
const storage = multer.diskStorage({    
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
}); // ^ this is how files are saved 

const upload = multer({ storage }); // this is how we upload files 

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register); 
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Routes 
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
// mongoose.set("strictQuery", true);
const PORT = process.env.PORT || 6001; // this is a back up port
mongoose.connect(process.env.MONGO_URL, {  // <- connect to database from node server
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`));


 // authentication - when we register and login
 // athorization - makes sure someone is logged in so you can perform certain actions
