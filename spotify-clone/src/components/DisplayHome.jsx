import React from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <>
      <Navbar />
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albumsData.length > 0 ? (
            albumsData.map((item) => (
              <AlbumItem
                key={item._id} // Sử dụng `_id` nếu đó là tên trường thực tế
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.image}
              />
            ))
          ) : (
            <p>No albums available.</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto">
          {songsData.length > 0 ? (
            songsData.map((item) => (
              <SongItem
                key={item._id} // Chắc chắn sử dụng `_id` hoặc tên trường chính xác
                name={item.name}
                desc={item.desc}
                id={item._id} // Sửa từ `item.id` thành `item._id`
                image={item.image}
              />
            ))
          ) : (
            <p>No songs available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;
