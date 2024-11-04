import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  console.log("Track data:", track); // Kiểm tra dữ liệu track
  console.log("Songs data:", songsData); // Kiểm tra dữ liệu songsData

  return (
    <div className="h-screen bg-black">
      {songsData && songsData.length > 0 ? (
        <>
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      ) : (
        <p className="text-white text-center">Loading...</p>
      )}

      <audio
        ref={audioRef}
        src={track && track.file ? track.file : ""}
        preload="auto"
      ></audio>
    </div>
  );
};

export default App;
