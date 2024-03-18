import express from "express";
import {
    getUser, 
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ routes - routes where we grab info without updating the database 
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE
router.patch("/:id/friendId", verifyToken, addRemoveFriend);

export default router;