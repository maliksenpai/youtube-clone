import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography, useMediaQuery } from '@mui/material';
import { VideoSearchArea } from '../view/VideoSearchArea';
import { MainDrawer } from '../view/MainDrawer';
import { VideoPreviewComponent } from '../components/VideoPreviewComponent';
import { useSelector } from 'react-redux';
import { getLikedVideos } from '../data/FirebaseVideoLikes';
import { useNavigate } from 'react-router';

export const LikedVideosPage = () => {
    const isSmallScreen = useMediaQuery(`(max-width:1024px)`);
    const navigator = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const userReducer = useSelector((state) => state.userReducer);

    useEffect(() => {
        getLikedVideos({ likedVideos: userReducer.likedVideos }).then((value) => {
            setLoading(false);
            setVideos(value);
        });
    }, []);

    useEffect(() => {
        if (!userReducer.uid) {
            navigator('/');
        }
    }, [userReducer]);

    return (
        <Box
            width={`calc(95% - ${isSmallScreen ? '50' : '240'}px)`}
            pl={`calc(${isSmallScreen ? '50' : '240'}px + 3%)`}
            pr={isSmallScreen ? '3%' : 0}
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
        >
            <VideoSearchArea />
            <Grid container justifyContent={'start'} alignItems={'start'} py={2}>
                <MainDrawer />
                <>
                    <Typography variant={'h5'} pb={2}>
                        History
                    </Typography>
                    {loading ? (
                        <Box
                            height={'100%'}
                            width={'90%'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container rowGap={1} columnGap={1} columns={13} justifyContent={'start'}>
                            {videos.map((element) => (
                                <Grid item md={3} sm={6} className={'videoCard'} key={element.id}>
                                    <VideoPreviewComponent video={element} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            </Grid>
        </Box>
    );
};
