"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { BiRepeat, BiShuffle } from "react-icons/bi"; // Import the loop and shuffle icons
import Slider from "./Slider";
import VideoSlider from "./VideoSlider"; // Import the VideoSlider component
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false); // State for loop functionality
  const [isShuffling, setIsShuffling] = useState(false); // State for shuffle functionality
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    let nextSong;
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * player.ids.length);
      nextSong = player.ids[randomIndex];
    } else {
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      nextSong = player.ids[currentIndex + 1];
    }

    if (!nextSong) {
      nextSong = player.ids[0];
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      if (isLooping) {
        play();
      } else {
        onPlayNext();
      }
    },
    onpause: () => setIsPlaying(false),
    onload: () => {
      if (sound) {
        setDuration(sound.duration() / 1000); // Set duration in seconds
      }
    },
    onplaying: () => {
      if (sound) {
        const interval = setInterval(() => {
          setCurrentTime(sound.seek() / 1000); // Update current time in seconds
        }, 1000);
        return () => clearInterval(interval);
      }
    },
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const togggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const handleTimeUpdate = (time: number) => {
    if (sound) {
      sound.seek(time * 1000); // Update the sound's seek position in milliseconds
      setCurrentTime(time);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>
      <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <BiShuffle
          onClick={toggleShuffle}
          size={30}
          className={`cursor-pointer transition ${isShuffling ? 'text-white' : 'text-neutral-400'}`}
        />
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />
        <div
          onClick={handlePlay}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="text-neutral-400 
            cursor-pointer 
            hover:text-white 
            transition"
        />
        <BiRepeat
          onClick={toggleLoop}
          size={30}
          className={`cursor-pointer transition ${isLooping ? 'text-white' : 'text-neutral-400'}`}
        />
      </div>
      <div className="hidden md:flex w-full justify-start custom-left-position">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={togggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
      <div className="col-span-2 md:col-span-3 flex justify-center">
        <VideoSlider
          duration={duration}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
      <style jsx>{`
        .custom-left-position {
          position: relative;
          left: 200px;
          padding-left: 16px; /* Adjust this value as needed */
        }
      `}</style>
    </div>
  );
};

export default PlayerContent;
