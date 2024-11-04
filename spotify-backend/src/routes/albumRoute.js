import express from 'express';
import { addAlbum, listAlbums, removeAlbum } from '../controllers/albumController.js';
import upload from '../middleware/multer.js';

const albumRouter = express.Router();

// Route để thêm album mới với middleware `upload.single('image')` để xử lý file upload
albumRouter.post('/add', upload.single('image'), addAlbum);

// Route để lấy danh sách album
albumRouter.get('/list', listAlbums);

// Route để xóa album dựa trên id
albumRouter.post('/remove', removeAlbum);

export default albumRouter;
