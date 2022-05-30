import { Avatar, Box, Card, CircularProgress, Grid, Typography, useMediaQuery } from '@mui/material';
import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../style/VideoStyle.css';
import { useRef, useState } from 'react';
import { UnStyledLink } from './UnstyledLink';
import ReactPlayer from 'react-player';

export const VideoPreviewComponent = ({ video, isSuggestVideo }) => {
    const [videoLoading, setVideoLoading] = useState(true);
    const isSmall = useMediaQuery('(max-width:900px)');
    const videoRef = useRef();

    return (
        <div>
            <Link className={'videoLink'} to={`/video/${video.id}`}>
                <Card elevation={0}>
                    <div className={`videoImgDiv ${isSmall && isSuggestVideo && 'videoImgDivSmall'}`}>
                        {videoLoading && <CircularProgress className={'videoImg'} color={'secondary'} />}
                        <ReactPlayer
                            ref={videoRef}
                            className={isSmall && isSuggestVideo ? 'videoImgSmall' : 'videoImg'}
                            url={video.data().url}
                            paused={'true'}
                            width={'100%'}
                            onLoadedData={() => {
                                setVideoLoading(false);
                                videoRef.current.seekTo(0);
                            }}
                        />
                        <div className={isSmall && isSuggestVideo ? 'videoDurationTextSmall' : 'videoDurationText'}>
                            {video.data().duration}
                        </div>
                    </div>
                    <Box py={1} className={isSmall && isSuggestVideo ? 'videoSmallContent' : ''}>
                        <Grid container gap={2}>
                            <Grid item md={2}>
                                <Link to={`/profile/${video.data().uploaderId}`}>
                                    <Avatar>
                                        <Person />
                                    </Avatar>
                                </Link>
                            </Grid>
                            <Grid item md={9}>
                                <div className={'videoContentTitle'}>{video.data().title}</div>
                                <UnStyledLink to={`/profile/${video.data().uploaderId}`}>
                                    <Typography textAlign={'start'} fontSize={12} variant={'subtitle2'} component={'p'}>
                                        {video.data().uploader}
                                    </Typography>
                                </UnStyledLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Link>
        </div>
    );
};
