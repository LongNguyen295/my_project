import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    spotifyId: { type: String, unique: true, required: true }, // ID nghệ sĩ từ Spotify
    name: { type: String, required: true }, // Tên nghệ sĩ
    genres: { type: [String], default: [] }, // Thể loại nhạc của nghệ sĩ
    image: { type: String, default: 'default-image-url.jpg' }, // URL ảnh đại diện của nghệ sĩ hoặc ảnh mặc định
    popularity: { type: Number, default: 0, min: 0, max: 100 }, // Mức độ nổi tiếng từ Spotify
    followers: { type: Number, default: 0, min: 0 }, // Số lượng người theo dõi từ Spotify
    external_urls: { type: String }, // Liên kết đến profile của nghệ sĩ trên Spotify (hoặc dùng Object nếu có nhiều URL)
    spotifyData: { type: Object, default: null } // Lưu dữ liệu chi tiết từ Spotify API nếu cần
}, { timestamps: true });

const artistModel = mongoose.model('Artist', artistSchema);
export default artistModel;
