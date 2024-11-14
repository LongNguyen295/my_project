import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    spotifyId: { type: String, unique: true },
    name: { type: String, required: true },
    desc: { type: String, required: false },
    album: { type: String, required: false }, // Thay đổi từ ObjectId sang String
    image: { type: String, required: false },
    file: { type: String, required: false },
    duration: { type: Number, required: true },
    external_urls: { type: Object, required: false },
    artists: [{
        name: { type: String, required: true },
        spotifyId: { type: String, required: false }
    }],
    spotifyData: { type: Object, default: null }
}, { timestamps: true });

const trackModel = mongoose.model("Track", trackSchema);

export default trackModel;
