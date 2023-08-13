import { Box, CircularProgress, Container, Divider, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Button } from 'comfort-react';
import { useEffect, useState } from 'react';
import { getProfileData } from '../data/FirebaseUser';
import { VideoPreviewComponent } from '../components/VideoPreviewComponent';
import { SentimentDissatisfied } from '@mui/icons-material';
import { UnStyledLink } from '../components/UnstyledLink';
import { getVideoFromProfile } from '../data/FirebaseVideo';
import '../style/VideoStyle.css';

export const ProfilePage = () => {
    const { id } = useParams();
    const userReducer = useSelector((state) => state.userReducer);
    const [currentUser, setCurrentUser] = useState(null);
    const [userVideos, setUserVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        console.log(currentUser);
        getProfileData({ id: id }).then((value) => {
            setCurrentUser(value);
            getVideoFromProfile({ email: value.email }).then((videos) => {
                setUserVideos(videos);
            });
            setLoading(false);
        });
    }, [id]);

    return (
        <Container>
            <Box display={'flex'} flexDirection={'column'} minHeight={'90vh'}>
                <Grid container>
                    <Grid container alignItems={'center'} justifyContent={'space-between'} p={4}>
                        <Typography variant={'h5'}>{userReducer.uid === id ? 'Your Videos' : 'Videos'}</Typography>
                        {userReducer.uid === id ? (
                            <UnStyledLink to={'/upload'}>
                                <Button color={'secondary'} variant={'contained'}>
                                    Upload New Video
                                </Button>
                            </UnStyledLink>
                        ) : (
                            <div />
                        )}
                    </Grid>
                    <Divider sx={{ width: '100%' }} />
                </Grid>
                {loading ? (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flex={1} height={'100%'}>
                        <CircularProgress color={'error'} />
                    </Box>
                ) : userVideos ? (
                    <Grid container rowGap={1} columnGap={1} columns={13} justifyContent={'start'} pt={4}>
                        {userVideos.map((element) => (
                            <Grid item md={3} sm={6} className={'videoCard'} key={element.id}>
                                <VideoPreviewComponent video={element} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        flex={1}
                        height={'100%'}
                    >
                        <Box pb={2}>
                            <SentimentDissatisfied fontSize={'large'} color={'error'} display={'block'} />
                        </Box>
                        <Box>
                            <Typography variant={'h4'}> There is no video</Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};
