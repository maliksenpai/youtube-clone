import { Avatar, Box, CardHeader, Divider, Grid, Typography } from '@mui/material';
import { Person, ThumbUp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UnStyledLink } from '../components/UnstyledLink';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton } from 'comfort-react';
import { dislikeVideo, likeVideo } from '../data/FirebaseVideoLikes';
import { updateDataUser } from '../redux/UserRedux';
import { subscribeUser, unsubscribeUser } from '../data/FirebaseSubscription';
import { getSubscriptionCount } from '../data/FirebaseUser';

export const VideoDetailInformation = (props) => {
    const [loading, setLoading] = useState(true);
    const [subscriptioned, setSubscriptioned] = useState(false);
    const [subscriptionCount, setSubscriptionCount] = useState('');
    const [likedVideo, setLikedVideo] = useState(false);
    const [likeCount, setLikeCount] = useState(props.likeCount);
    const userReducer = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        setLikedVideo(userReducer.likedVideos.includes(props.id));
        setSubscriptioned(userReducer.subscriptions.includes(props.uploaderId));
        getSubscriptionCount({ id: props.uploaderId }).then((value) => {
            setSubscriptionCount(value);
            setLoading(false);
        });
    }, [props.videoKey]);

    const handleLikeButton = () => {
        if (!likedVideo) {
            likeVideo({
                videoKey: props.videoKey,
                videoId: props.id,
                likeCount: likeCount,
                userId: userReducer.uid,
                likedVideos: userReducer.likedVideos,
            }).then((value) => {
                const copyUser = { ...userReducer };
                copyUser.likedVideos = value;
                setLikedVideo(true);
                setLikeCount(likeCount + 1);
                dispatch(updateDataUser(copyUser));
            });
        } else {
            dislikeVideo({
                videoKey: props.videoKey,
                videoId: props.id,
                likeCount: likeCount,
                userId: userReducer.uid,
                likedVideos: userReducer.likedVideos,
            }).then((value) => {
                const copyUser = { ...userReducer };
                copyUser.likedVideos = value;
                setLikedVideo(false);
                setLikeCount(likeCount - 1);
                dispatch(updateDataUser(copyUser));
            });
        }
    };

    const handleSubscribeButton = () => {
        if (!loading) {
            if (!subscriptioned) {
                subscribeUser({
                    subscribeUserId: props.uploaderId,
                    subscriptionCount: subscriptionCount,
                    userId: userReducer.uid,
                    subscriptions: userReducer.subscriptions,
                }).then((value) => {
                    const copyUser = { ...userReducer };
                    copyUser.subscriptions = value;
                    setSubscriptioned(true);
                    setSubscriptionCount(subscriptionCount + 1);
                    dispatch(updateDataUser(copyUser));
                });
            } else {
                unsubscribeUser({
                    subscribeUserId: props.uploaderId,
                    subscriptionCount: subscriptionCount,
                    userId: userReducer.uid,
                    subscriptions: userReducer.subscriptions,
                }).then((value) => {
                    const copyUser = { ...userReducer };
                    copyUser.subscriptions = value;
                    setSubscriptioned(false);
                    setSubscriptionCount(subscriptionCount - 1);
                    dispatch(updateDataUser(copyUser));
                });
            }
        }
    };

    return (
        <Box pt={2} pr={2} display={'flex'} justifyContent={'space-between'}>
            <Box>
                <Typography variant={'h5'} textAlign={'start'} py={1}>
                    {props.title}
                </Typography>
                <CardHeader
                    avatar={
                        <Link to={`/profile/${props.uploaderId}`}>
                            <Avatar>
                                <Person />
                            </Avatar>
                        </Link>
                    }
                    title={
                        <>
                            <UnStyledLink to={`/profile/${props.uploaderId}`}>
                                <Typography display={'inline'} variant={'h6'}>
                                    {props.uploader}
                                </Typography>
                            </UnStyledLink>
                            {userReducer.uid && userReducer.uid !== props.uploaderId && (
                                <Box>
                                    {!loading && (
                                        <Typography display={'inline'} pr={0.5}>
                                            {subscriptionCount}
                                        </Typography>
                                    )}
                                    <Button
                                        variant={subscriptioned ? 'outlined' : 'contained'}
                                        onClick={handleSubscribeButton}
                                    >
                                        {subscriptioned ? 'Unsubscribe' : 'Subscribe'}
                                    </Button>
                                </Box>
                            )}
                        </>
                    }
                />
                <Typography variant={'h6'}> Description </Typography>
                <Divider sx={{ width: '100%', p: 1 }} />
                <Typography textAlign={'start'} py={1}>
                    {props.description}
                </Typography>
            </Box>
            <Box>
                <Grid container direction="row" alignItems="center">
                    <IconButton p={0.5} onClick={handleLikeButton}>
                        <ThumbUp color={likedVideo ? 'primary' : 'disabled'} />
                    </IconButton>
                    <Grid item p={0.5}>
                        {likeCount}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
