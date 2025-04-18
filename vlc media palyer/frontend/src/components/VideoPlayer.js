import React, { useState, useEffect, useRef } from 'react';
import '../VideoPlayer.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/videos')
      .then(res => res.json())
      .then(data => setVideoList(data));
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeekbarChange = (e) => {
    if (videoRef.current) {
      videoRef.current.currentTime = e.target.value;
    }
  };

  const handleSeekbarClick = (e) => {
    if (videoRef.current) {
      const seekBarWidth = e.target.offsetWidth;
      const clickPosition = e.nativeEvent.offsetX;
      const newTime = (clickPosition / seekBarWidth) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      videoRef.current.play();
    }
  };

  const handleSeekbarMouseDown = () => {
    setIsSeeking(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleSeekbarMouseUp = () => {
    setIsSeeking(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {currentVideo && (
          <video
            ref={videoRef}
            src={currentVideo}
            controls
            onClick={handlePlayPause}
            style={{ filter: `brightness(${brightness})` }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                document.getElementById('seekbar').max = videoRef.current.duration;
              }
            }}
            onTimeUpdate={() => {
              if (!isSeeking && videoRef.current) {
                document.getElementById('seekbar').value = videoRef.current.currentTime;
              }
            }}
          />
        )}
      </div>

      <div className="controls">
        <input
          id="seekbar"
          type="range"
          min="0"
          step="0.1"
          onChange={handleSeekbarChange}
          onMouseDown={handleSeekbarMouseDown}
          onMouseUp={handleSeekbarMouseUp}
          onClick={handleSeekbarClick}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
            if (videoRef.current) {
              videoRef.current.volume = e.target.value;
            }
          }}
        />
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={brightness}
          onChange={(e) => setBrightness(e.target.value)}
        />
      </div>

      <div className="video-list">
        {videoList.map((video, idx) => (
          <div key={idx} onClick={() => setCurrentVideo(`http://localhost:5000/videos/${video.name}`)}>
            {video.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
