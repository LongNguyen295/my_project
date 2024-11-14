import express from "express";
import { addTrack, listTracks, removeTrack, getSpotifyTrack } from "../controllers/trackController.js"; // Đổi từ songController sang trackController nếu đã đổi tên
import upload from "../middleware/multer.js";

const trackRouter = express.Router();

// Route để thêm track với upload audio và image
trackRouter.post("/add", upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]), addTrack);

// Route để lấy danh sách track
trackRouter.get("/list", listTracks);

// Route để xóa track
trackRouter.post("/remove", removeTrack);

// Route để lấy thông tin track từ Spotify
trackRouter.get("/track/:trackId", getSpotifyTrack);

export default trackRouter;
