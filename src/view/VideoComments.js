import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import { Person, SentimentDissatisfied } from '@mui/icons-material';

export const VideoComments = ({ comments }) => {
    return (
        <>
            <Typography variant={'h6'}> Comments </Typography>
            <Box py={2}>
                <Divider sx={{ width: '100%' }} />
            </Box>
            {comments.length > 0 ? (
                comments.map((element) => {
                    return (
                        <Box key={element.id} py={1}>
                            <Grid container justifyContent={'start'} textAlign={'start'}>
                                <Grid item sm={0.8} xs={12} alignSelf={'center'} justifySelf={'center'}>
                                    <Avatar>
                                        <Person />
                                    </Avatar>
                                </Grid>
                                <Grid item sm={11} xs={12}>
                                    <Box>
                                        <Typography
                                            sx={{ pr: 1 }}
                                            variant={'subtitle2'}
                                            display={'inline'}
                                            fontWeight={'bolder'}
                                        >
                                            {element.data().sender}
                                        </Typography>
                                        <Typography fontSize={'x-small'} color={'grey'} display={'inline'}>
                                            {new Date(element.data().date).toLocaleString('en')}
                                        </Typography>
                                    </Box>
                                    <Box py={1}>
                                        <Typography variant={'body2'} fontSize={'small'}>
                                            {element.data().message}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })
            ) : (
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flex={1}
                    py={4}
                    height={'100%'}
                >
                    <Box pb={2}>
                        <SentimentDissatisfied fontSize={'large'} color={'error'} display={'block'} />
                    </Box>
                    <Box>
                        <Typography variant={'h4'}> There is no comment</Typography>
                    </Box>
                </Box>
            )}
        </>
    );
};
