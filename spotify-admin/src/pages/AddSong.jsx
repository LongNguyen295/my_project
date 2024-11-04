import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddSong = () => {
  const [songData, setSongData] = useState({
    name: "",
    desc: "",
    album: "",
    file: null,
    image: null,
  });

  const [albums, setAlbums] = useState([]); // Thêm state để lưu danh sách album
  const [loading, setLoading] = useState(false);

  // Hàm để lấy danh sách album từ API
  const fetchAlbums = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/album/list");
      if (response.data.success) {
        setAlbums(response.data.albums); // Lưu danh sách album vào state
      } else {
        toast.error("Failed to load albums");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Error occurred while fetching albums");
    }
  };

  // Gọi API lấy danh sách album khi component được mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleChange = (e) => {
    setSongData({
      ...songData,
      [e.target.name]: e.target.value,
    });
  };

  // Kiểm tra tệp âm thanh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setSongData({ ...songData, file });
    } else {
      toast.error("Please select a valid audio file.");
    }
  };

  // Kiểm tra tệp hình ảnh
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image && image.type.startsWith("image/")) {
      setSongData({ ...songData, image });
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", songData.name);
    formData.append("desc", songData.desc);
    formData.append("album", songData.album);
    if (songData.file) {
      formData.append("audio", songData.file);
    }
    if (songData.image) {
      formData.append("image", songData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/song/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Song added successfully");
        setSongData({
          name: "",
          desc: "",
          album: "",
          file: null,
          image: null,
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      // Hiển thị chi tiết lỗi từ backend (nếu có)
      const errorMessage =
        error?.response?.data?.message || "Error occurred while adding song";
      toast.error(errorMessage);

      // Log toàn bộ lỗi để kiểm tra chi tiết nếu cần
      console.error("Error uploading song:", error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        {/* Upload Song Section */}
        <div className="flex flex-col items-center">
          <p>Upload Song</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept="audio/*"
            hidden
            id="file"
          />
          <label htmlFor="file" className="cursor-pointer">
            <div className="flex items-center justify-center w-20 h-20 border-2 border-gray-400 bg-gray-100">
              {songData.file ? "✔" : "Upload"}
            </div>
          </label>
        </div>

        {/* Upload Image Section */}
        <div className="flex flex-col items-center">
          <p>Upload Image</p>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            hidden
            id="image"
          />
          <label htmlFor="image" className="cursor-pointer">
            <div className="flex items-center justify-center w-20 h-20 border-2 border-gray-400 bg-gray-100">
              {songData.image ? "✔" : "Upload"}
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song Name</p>
        <input
          type="text"
          name="name"
          placeholder="Type here"
          value={songData.name}
          onChange={handleChange}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song Description</p>
        <input
          type="text"
          name="desc"
          placeholder="Type here"
          value={songData.desc}
          onChange={handleChange}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          name="album"
          value={songData.album}
          onChange={handleChange}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
        >
          <option value="">Select an album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        type="submit"
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </form>
  );
};

export default AddSong;
