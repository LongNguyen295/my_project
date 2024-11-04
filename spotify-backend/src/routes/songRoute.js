import express from "express";
import { addSong, listSong, removeSong } from "../controllers/songController.js";
import upload from "../middleware/multer.js";

const songRouter = express.Router();

// Sử dụng upload.fields để xử lý upload audio và image
songRouter.post("/add", upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]), addSong);
songRouter.get("/list", listSong);
songRouter.post("/remove", removeSong);

export default songRouter;
