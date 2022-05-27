import { useEffect, useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { CircularProgress, Grid, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router';
import { getSuggestVideos, getVideoFromId } from '../data/FirebaseVideo';
import '../style/VideoStyle.css';
import { VideoDetailInformation } from '../view/VideoDetailInformation';
import { VideoComments } from '../view/VideoComments';
import { Button, IconButton, TextField, useValidatableForm } from 'comfort-react';
import { Send } from '@mui/icons-material';
import { addNewComment, getCommentsFromVideo } from '../data/FirebaseComments';
import { VideoPreviewComponent } from '../components/VideoPreviewComponent';
import { VideoSearchArea } from '../view/VideoSearchArea';
import { useSelector } from 'react-redux';

const rules = [
    {
        path: 'comment',
        ruleSet: [{ rule: 'required' }],
    },
];

export const VideoPage = () => {
    const { id } = useParams();
    const [videoData, setVideoData] = useState(null);
    const [suggestVideos, setSuggestVideos] = useState(null);
    const userReducer = useSelector((state) => state.userReducer);
    const [comments, setComments] = useState(null);
    const [loadingInput, setLoadingInput] = useState(false);
    const isSmall = useMediaQuery('(max-width:600px)');
    const {
        formData,
        isValid,
        setPathIsBlurred,
        setPathValue,
        getValue,
        getError,
        setFormData,
        resetForm,
    } = useValidatableForm({
        rules,
        hideBeforeSubmit: true,
        showAfterBlur: true,
        focusToErrorAfterSubmit: true,
    });

    const handleSendCommit = async () => {
        if (isValid) {
            setLoadingInput(true);
            await addNewComment({ message: formData.comment, videoId: id });
            setLoadingInput(false);
            setFormData('comment', '');
            resetForm();
            getCommentsFromVideo({ id }).then((comments) => setComments(comments));
        }
    };

    useEffect(() => {
        getVideoFromId({ id }).then((value) => {
            setVideoData(value.data());
            getCommentsFromVideo({ id }).then((comments) => setComments(comments));
            getSuggestVideos({ currentVideo: value }).then((newSuggestVideos) => setSuggestVideos(newSuggestVideos));
        });
    }, []);

    return (
        <Grid container flexDirection={'row'} gap={1} columns={13} px={5} pt={2} justifyContent={'center'}>
            <VideoSearchArea />
            <Grid item md={9} sm={12}>
                <Grid container flexDirection={'column'}>
                    {videoData ? (
                        <>
                            <VideoPlayer video={videoData} isBig />
                            <VideoDetailInformation
                                uploader={videoData.uploader}
                                uploaderId={videoData.uploaderId}
                                description={videoData.description}
                                title={videoData.title}
                            />
                        </>
                    ) : (
                        <div className={'videoPlayerLoadingDiv'}>
                            <CircularProgress />
                        </div>
                    )}
                </Grid>
                <Grid>{comments && <VideoComments comments={comments} />}</Grid>
                {userReducer.uid && (
                    <Grid container flexDirection={'row'} justifyContent={'center'} alignItems={'center'} py={3}>
                        <Grid item sm={11} xs={12}>
                            <TextField
                                fullWidth
                                placeholder={'Comment'}
                                error={!!getError('comment')}
                                helperText={getError('comment')}
                                type={'text'}
                                disabled={loadingInput}
                                value={getValue('comment') || ''}
                                onChange={(e) => setPathValue('comment', e)}
                                onSubmit={handleSendCommit}
                                onBlur={() => setPathIsBlurred('comment')}
                                id="comment"
                            />
                        </Grid>
                        {isSmall ? (
                            <Button fullWidth variant={'contained'} disabled={loadingInput} onClick={handleSendCommit}>
                                <Send />
                            </Button>
                        ) : (
                            <IconButton disabled={loadingInput} onClick={handleSendCommit}>
                                <Send />
                            </IconButton>
                        )}
                    </Grid>
                )}
            </Grid>
            <Grid item md={3} sm={12} sx={{ backgroundColor: '#f1f1f1' }}>
                {!suggestVideos ? (
                    <CircularProgress />
                ) : (
                    suggestVideos.map((element) => {
                        return <VideoPreviewComponent key={element.id} video={element} isSuggestVideo />;
                    })
                )}
            </Grid>
        </Grid>
    );
};
