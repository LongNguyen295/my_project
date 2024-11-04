import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../App";
import { toast } from "react-toastify";

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  const fetchAlbums = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const response = await axios.get(`${url}/api/album/list`);
      console.log(response.data); // Kiểm tra phản hồi từ API

      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error("Failed to fetch albums. Please try again.");
      }
    } catch (error) {
      toast.error("Error occurred while fetching albums");
      console.error("Fetch albums error:", error);
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
    }
  };

  const handleRemoveAlbum = async (id) => {
    console.log("Deleting album with ID:", id); // Kiểm tra ID trước khi gửi

    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        // Cập nhật lại danh sách album sau khi xóa
        setData((prevData) => prevData.filter((album) => album._id !== id));
      } else {
        toast.error("Failed to delete album. Please try again.");
      }
    } catch (error) {
      toast.error("Error occurred while deleting album");
      console.error("Delete album error:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p>All Albums List</p>
      <br />
      {loading ? ( // Hiển thị thông báo khi đang tải dữ liệu
        <p>Loading albums...</p>
      ) : (
        <div>
          <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
            <b>Image</b>
            <b>Name</b>
            <b>Description</b>
            <b>Album Colour</b>
            <b>Action</b>
          </div>

          {data.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
            >
              <img className="w-12" src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input type="color" defaultValue={item.bgColour} disabled />
              <p
                onClick={() => handleRemoveAlbum(item._id)}
                className="cursor-pointer text-red-600"
              >
                x
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAlbum;
