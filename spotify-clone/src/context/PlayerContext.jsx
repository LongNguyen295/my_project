// Context để lưu trữ và quản lý trạng thái phát nhạc

import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const url = "http://localhost:4000";

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = (id) => {
    const selectedTrack = songsData.find((item) => item._id === id);
    console.log("Selected Track:", selectedTrack); // Ghi log bài hát được chọn
    if (selectedTrack) {
      setTrack(selectedTrack);
      if (audioRef.current) {
        audioRef.current.src = selectedTrack.file; // Gán src cho audioRef
        audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  const previous = () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex > 0) {
      const prevTrack = songsData[currentIndex - 1];
      setTrack(prevTrack);
      if (audioRef.current) {
        audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  const next = () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex < songsData.length - 1) {
      const nextTrack = songsData[currentIndex + 1];
      setTrack(nextTrack);
      if (audioRef.current) {
        audioRef.current.play();
        setPlayStatus(true);
      }
    }
  };

  const seekSong = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data && response.data.songs) {
        setSongsData(response.data.songs);
        setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error("Error loading songs data:", error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data && response.data.albums) {
        setAlbumsData(response.data.albums);
      }
    } catch (error) {
      console.error("Error loading albums data:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = () => {
          seekBar.current.style.width = `${Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          )}%`;

          setTime({
            currentTime: {
              second: Math.floor(audioRef.current.currentTime % 60),
              minute: Math.floor(audioRef.current.currentTime / 60),
            },
            totalTime: {
              second: Math.floor(audioRef.current.duration % 60),
              minute: Math.floor(audioRef.current.duration / 60),
            },
          });
        };
      }
    }, 1000);
  }, [audioRef]);

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
