import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    spotifyId: { type: String, unique: true }, // ID của album từ Spotify
    name: { type: String, required: true },
    desc: { type: String, required: true }, // Mô tả album
    bgColour: { type: String, required: true }, // Màu nền của album
    image: { type: String, required: true }, // URL ảnh từ Cloudinary hoặc nguồn khác
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist' // Tham chiếu đến model 'Artist'
    }],
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track' // Tham chiếu đến model 'Track'
    }],
    spotifyData: { type: Object, default: null } // Dữ liệu từ Spotify API nếu cần
}, { timestamps: true });

const albumModel = mongoose.model('Album', albumSchema);
export default albumModel;
