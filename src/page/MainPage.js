import { Box, CircularProgress, Container, Grid } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { getVideos } from '../data/FirebaseVideo';
import { VideoPreviewComponent } from '../components/VideoPreviewComponent';
import '../style/VideoStyle.css';
import { VideoSearchArea } from '../view/VideoSearchArea';
import { useLocation } from 'react-router';

export const MainPage = () => {
    const location = useLocation();
    const [videos, setVideos] = useState();
    const [loadingInitial, setloadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isMoreVideo, setIsMoreVideo] = useState(true);
    const videosRef = useRef();
    let search = new URLSearchParams(location.search).get('search');

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const bottom = videosRef.current?.getBoundingClientRect().bottom <= window.innerHeight;
            if (bottom && !loadingMore) {
                setLoadingMore(true);
            }
        });
        getVideos({ search: search }).then((value) => {
            setloadingInitial(false);
            setVideos(value);
            if (value.length === 12) {
                setIsMoreVideo(true);
            }
        });

        return () => {
            window.removeEventListener('scroll', () => null);
        };
    }, []);

    useEffect(() => {
        if (loadingMore && isMoreVideo) {
            getVideos({ lastVideo: videos[videos.length - 1], search: search }).then((value) => {
                setVideos([...videos, ...value]);
                if (value.length <= 12) {
                    setIsMoreVideo(false);
                } else {
                    setIsMoreVideo(true);
                }
                setLoadingMore(false);
            });
        }
    }, [loadingMore]);

    useEffect(() => {
        setVideos(null);
        setloadingInitial(true);
        setIsMoreVideo(true);
        getVideos({ search: search }).then((value) => {
            setloadingInitial(false);
            setVideos(value);
            if (value.length === 12) {
                setIsMoreVideo(true);
            }
        });
    }, [search]);

    return (
        <Container>
            <VideoSearchArea />
            <Grid container justifyContent={'space-between'} alignItems={'start'} py={2}>
                {loadingInitial ? (
                    <Box
                        height={'100%'}
                        width={'100%'}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container rowGap={1} columnGap={1} columns={13} justifyContent={'start'} ref={videosRef}>
                        {videos.map((element) => (
                            <Grid item md={3} sm={6} className={'videoCard'} key={element.id}>
                                <VideoPreviewComponent video={element} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};
