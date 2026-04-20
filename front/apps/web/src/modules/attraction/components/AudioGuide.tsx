import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Headphones } from 'lucide-react';
import './AudioGuide.css';

interface AudioGuideProps {
    audioUrl: string;
}

export const AudioGuide: React.FC<AudioGuideProps> = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (audioRef.current) {
            const time = (value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setProgress(value);
        }
    };

    return (
        <div className="audio-guide-container glass">
            <div className="audio-header">
                <Headphones size={18} className="audio-icon-main" />
                <span>Audio Guide</span>
            </div>

            <div className="audio-controls">
                <button className="play-pause-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </button>

                <div className="audio-info-wrapper">
                    <div className="audio-timer">
                        <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                        <span className="divider">/</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div className="progress-container">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={progress} 
                            onChange={handleProgressChange}
                            className="audio-progress"
                        />
                    </div>
                </div>

                <div className="volume-icon">
                    <Volume2 size={18} />
                </div>
            </div>

            <audio 
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};
