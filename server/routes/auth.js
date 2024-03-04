import express from "express";
import { login } from "../controllers/auth.js";

// set up a router, allows express to identify that these routes will  will all be configured 
const router = express.Router();

router.post("/login", login);

export default router;