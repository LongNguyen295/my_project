// Hiển thị nội dung chính của trang

import React, { useEffect, useRef, useContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { PlayerContext } from "../context/PlayerContext";

const Display = () => {
  const { albumsData } = useContext(PlayerContext);

  // Color background album
  const displayRef = useRef(null);
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");

  // Lấy albumId từ URL
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";

  // Lấy album dựa trên albumId
  const album = albumsData.find((x) => x._id == albumId);
  const bgColor = album ? album.bgColour : "#121212"; // Sử dụng màu mặc định nếu album không tồn tại

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum
        ? `linear-gradient(${bgColor}, #121212)`
        : "#121212";
    }
  }, [isAlbum, bgColor]); // Thêm bgColor và isAlbum vào mảng phụ thuộc

  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
    >
      {albumsData.length > 0 ? (
        <Routes>
          <Route path="/" element={<DisplayHome />} />
          <Route
            path="/album/:id"
            element={<DisplayAlbum album={album || {}} />} // Truyền album với giá trị mặc định nếu không tìm thấy
          />
        </Routes>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
};

export default Display;
