// import { useEffect, useRef, useState } from "react";

// // PROJECT IMPORT
// //import { baseUrl } from "@/API/baseURL";
// import { Icon, Slider } from "../ui-components";
// import { downloadFile, formatTime } from "@/helperFunctions";

// // TYPES
// interface AudioPlayerProps {
//   className?: string;
//   src: string;
//   name: string;
//   index?: number;
// }

// const baseUrl = process.env.BASE_URL;

// const AudioPlayer = (props: AudioPlayerProps) => {
//   const { className, src, name } = props;

//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [timeStatus, setTimeStatus] = useState<any>(0);
//   const [duration, setDuration] = useState<any>(0);
//   const [volume, setVolume] = useState<any>(100);
//   const [volumeVisible, setVolumeVisible] = useState<boolean>(false);
//   const ref = useRef<any>();

//   useEffect(() => {
//     getUrl();
//     if (!ref?.current) return;
//     ref?.current?.load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ref]);

//   useEffect(() => {
//     if (!ref?.current) return;
//     if (isPlaying) {
//       ref.current.play();
//     } else {
//       ref.current.pause();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPlaying, ref]);

//   useEffect(() => {
//     if (!ref?.current) return;
//     const v = (parseInt(volume, 10) || 0) / 100;
//     ref.current.volume = v;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [volume, ref]);

//   // Play or Pause Audio
//   const onPlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   // Set Time Status for Progress Bar & Show Time
//   const onTimeUpdate = (e: any) => {
//     if (e.target.paused) {
//       setIsPlaying(false);
//       setTimeStatus(0);
//     }
//     setTimeStatus(e.target?.currentTime);
//   };

//   // Get URL for Audio
//   const getUrl = () => {
//     const url = `${baseUrl}/${src}`;
//     return url;
//   };
// console.log("getUrlgetUrl",getUrl());

//   const onChange = (e: any) => {
//     ref.current.currentTime = e.target.value;
//     setTimeStatus(e.target.value);
//   };

//   return (
//     <div className="relative">
//       {volumeVisible && (
//         <div className={`absolute right-14 top-0`}>
//           <Slider
//             className="z-50"
//             vertical
//             value={volume}
//             onChange={(e: any) => {
//               setVolume(e.target.value);
//             }}
//           />
//         </div>
//       )}
//       <audio
//         ref={ref}
//         onTimeUpdate={onTimeUpdate}
//         onLoadedMetadata={(e: any) => {
//           setDuration(e.target?.duration ? e.target?.duration : 0);
//         }}
//       >
//         <source src={getUrl()} />
//       </audio>
//       <div className={`${className} flex gap-4 items-center`}>
//         <Icon
//           name={isPlaying ? "Close" : "Play"}
//           width={20}
//           height={20}
//           alt="Play"
//           onClick={onPlayPause}
//         />
//         <span>
//           {formatTime(timeStatus)}/ {formatTime(duration)}
//         </span>
//         <input
//           className="!bg-primary-v10 h-1 focus:bg-primary focus:accent-primary focus:outline-none outline-none accent-primary"
//           type="range"
//           min={0}
//           max={Math.floor(duration)}
//           step="1"
//           value={timeStatus}
//           onMouseUp={onChange}
//           onChange={onChange}
//         />
//         <Icon
//           name="Volume"
//           width={20}
//           height={20}
//           alt="Volume"
//           onClick={() => {
//             setVolumeVisible(!volumeVisible);
//           }}
//         />
//         <Icon
//           name="Download"
//           width={20}
//           height={20}
//           alt="Download"
//           onClick={() => {
//             downloadFile(getUrl(), name);
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;
"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, Slider } from "../ui-components";
import { downloadFile, formatTime } from "@/helperFunctions";

interface AudioPlayerProps {
  className?: string;
  src: string;
  name: string;
  index?: number;
}

const baseUrl = process.env.BASE_URL || "";

const AudioPlayer = ({ className, src, name }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeStatus, setTimeStatus] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const myId = useRef(Math.random());
  const ref = useRef<HTMLAudioElement>(null);
  const audioUrl = `${baseUrl.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
  console.log("audioUrl", audioUrl);

  /**
   * 🔥 GLOBAL STOP LISTENER
   * When ANY audio starts, all others stop
   */
  useEffect(() => {
    const stopHandler = (e: CustomEvent) => {
      // if (ref.current && e.target !== ref.current) {
      //   ref.current.pause();
      //   ref.current.currentTime = 0;
      //   setIsPlaying(false);
      // }
      if (ref.current && e.detail?.id !== myId.current) {
        ref.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("stop-all-audio", stopHandler as EventListener);
    return () =>
      window.removeEventListener("stop-all-audio", stopHandler as EventListener);
  }, []);

  /** ▶️ Play / Pause */
  const onPlayPause = () => {
    const audio = ref.current;
    if (!audio) return;

    if (!isPlaying) {
      // 🔥 STOP everyone else
      // window.dispatchEvent(new Event("stop-all-audio"));
      window.dispatchEvent(new CustomEvent("stop-all-audio", { detail: { id: myId.current } }));

      audio.play().catch(console.error);
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const onTimeUpdate = (e: any) => {
    setTimeStatus(e.target.currentTime || 0);
  };

  const onChange = (e: any) => {
    if (ref.current) {
      ref.current.currentTime = e.target.value;
      setTimeStatus(e.target.value);
    }
  };
  /** ⏹️ When audio ends */
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const onEnded = () => {
      setIsPlaying(false);
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);
  /** 🔊 Volume */
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume / 100;
    }
  }, [volume]);


  /** Playback Speed */
  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);




  return (
    <div className="relative">
      {volumeVisible && (
        <div className="absolute right-14 top-0 z-10">
          <Slider
            vertical
            value={volume}
            onChange={(e: any) => setVolume(e.target.value)}
          />
        </div>
      )}

      <audio
        ref={ref}
        src={audioUrl}
        onTimeUpdate={(e: any) =>
          setTimeStatus(e.target.currentTime || 0)
        }
        onLoadedMetadata={(e: any) =>
          setDuration(e.target.duration || 0)
        }
      />


      <div className={`${className} flex gap-4 items-center`}>
        <Icon
          name={isPlaying ? "Close" : "Play"}
          width={20}
          height={20}
          alt="Play"
          onClick={onPlayPause}
          className="cursor-pointer"
        />

        <span className="text-xs">
          {formatTime(timeStatus)} / {formatTime(duration)}
        </span>

        <input
          type="range"
          min={0}
          max={Math.floor(duration)}
          value={timeStatus}
          onChange={(e: any) => {
            if (ref.current) {
              ref.current.currentTime = e.target.value;
              setTimeStatus(e.target.value);
            }
          }}
          className="!bg-primary-v10 h-1 focus:accent-primary outline-none accent-primary"
        />

        <Icon
          name="Volume"
          width={20}
          height={20}
          alt="Volume"
          onClick={() => setVolumeVisible(!volumeVisible)}
          className="cursor-pointer"
        />

        <Icon
          name="Download"
          width={20}
          height={20}
          alt="Download"
          onClick={() => downloadFile(audioUrl, name)}
          className="cursor-pointer"
        />


        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer outline-none focus:border-primary"
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
};

export default AudioPlayer;
