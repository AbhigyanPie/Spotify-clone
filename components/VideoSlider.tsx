import { useState, useEffect } from "react";

interface VideoSliderProps {
  duration: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

const VideoSlider: React.FC<VideoSliderProps> = ({
  duration,
  currentTime,
  onTimeUpdate,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    onTimeUpdate(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center justify-between video-slider-container">
      <span>{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSliderChange}
        className="slider"
      />
      <span>{formatTime(duration - currentTime)}</span>
      <style jsx>{`
        .video-slider-container {
          width: 250px;
          margin: 10px 0;
          display: flex;
          align-items: center;
        }
        .slider {
          width: 100%;
          margin: 0 10px;
          appearance: none;
          height: 5px;
          background: #4caf50;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .slider:hover {
          opacity: 1;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #4caf50;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #4caf50;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VideoSlider;
