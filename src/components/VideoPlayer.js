import { useEffect, useRef, useState } from 'react';
import { Slider } from '@mui/material';
import { IconButton } from 'comfort-react';
import { Fullscreen, Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import '../style/VideoStyle.css';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

export const VideoPlayer = (props) => {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState('00:00');
    const [durationPercent, setDurationPercent] = useState(0);
    const [volume, setVolume] = useState(100);
    const [videoDuration, setVideoDuration] = useState(0);
    const videoRef = useRef();
    const handleFullscreen = useFullScreenHandle();
    const [fullscreen, setFullscrenn] = useState(false);

    useEffect(() => {
        setFullscrenn(handleFullscreen.active);
    }, [handleFullscreen]);

    const handleProgress = (progress) => {
        setDuration(new Date(1000 * progress.playedSeconds).toISOString().substr(14, 5));
        setDurationPercent(progress.played * 100);
    };

    const handleStopAndResume = () => {
        setPlaying(!playing);
    };

    const handleChangeVolume = (event, newValue) => {
        setVolume(newValue);
    };

    const handleVolumeButton = () => {
        setVolume(volume === 0 ? 100 : 0);
    };

    const handleChangeDuration = (event, newValue) => {
        const newDuration = (newValue / 100) * videoDuration;
        setDuration(new Date(newDuration / 100).toISOString().substr(14, 5));
        setDurationPercent((newDuration / videoDuration) * 100);
        videoRef.current.seekTo(newDuration / videoDuration);
    };

    const handleFullscreenFunc = () => {
        if (fullscreen) {
            handleFullscreen.exit();
        } else {
            handleFullscreen.enter();
        }
    };

    return (
        <FullScreen handle={handleFullscreen}>
            <div className={`videoPlayerRelative ${fullscreen && 'videoPlayerRelativeFullscreen'}`}>
                <div onClick={handleStopAndResume}>
                    <ReactPlayer
                        ref={videoRef}
                        className={props.isBig && 'videoPlayerBig'}
                        url={props.video.url}
                        playing={playing}
                        loop={!props.isBig && true}
                        width={'100%'}
                        height={fullscreen ? '100vh' : '500px'}
                        volume={volume / 100}
                        onProgress={handleProgress}
                        onDuration={(currentVideoDuration) => setVideoDuration(currentVideoDuration)}
                    />
                </div>
                <div className={'videoPlayerBottom'}>
                    <Slider
                        className={'videoPlayerDurationSlider'}
                        sx={{ width: '100%', p: 0, color: 'red' }}
                        value={durationPercent}
                        onChange={handleChangeDuration}
                    />
                    <div className={'videoPlayerControlPanel'}>
                        <div className={'videoPlayerControlPanelSection'}>
                            <IconButton title={playing ? 'Stop' : 'Play'} onClick={handleStopAndResume}>
                                {playing ? (
                                    <Pause sx={{ color: '#f1f1f1' }} />
                                ) : (
                                    <PlayArrow sx={{ color: '#f1f1f1' }} />
                                )}
                            </IconButton>
                            <IconButton title={'Volume'} onClick={handleVolumeButton}>
                                {volume < 50 ? (
                                    <VolumeDown sx={{ color: '#f1f1f1' }} />
                                ) : (
                                    <VolumeUp sx={{ color: '#f1f1f1' }} />
                                )}
                            </IconButton>
                            <Slider
                                sx={{ width: '20%', mx: 1, color: '#f1f1f1' }}
                                aria-label="Volume"
                                value={volume}
                                onChange={handleChangeVolume}
                            />
                            <div className={'videoPlayerDuration'}>
                                {duration} / {props.video.duration}
                            </div>
                        </div>
                        <div className={'videoPlayerControlPanelSection videoPlayerControlPanelSecond'}>
                            <IconButton onClick={handleFullscreenFunc}>
                                <Fullscreen sx={{ color: '#f1f1f1' }} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </FullScreen>
    );
};
