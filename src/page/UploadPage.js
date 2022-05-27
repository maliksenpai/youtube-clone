import Dropzone from 'react-dropzone';
//import { uploadVideo } from '../data/FirebaseVideo';
import { useState } from 'react';
import { useValidatableForm } from 'comfort-react';
import { Box, Container, Grid, LinearProgress, Typography } from '@mui/material';
import { Button, TextField } from 'comfort-react';
import getBlobDuration from 'get-blob-duration';
import { VideoPlayer } from '../components/VideoPlayer';
import { addVideoDatabase, uploadVideo } from '../data/FirebaseVideo';
import { SentimentSatisfied } from '@mui/icons-material';
import { UnStyledLink } from '../components/UnstyledLink';
import { createId } from '../utils/idGenerator';

const rules = [
    {
        path: 'title',
        ruleSet: [{ rule: 'required' }],
    },
    {
        path: 'description',
        ruleSet: [{ rule: 'required' }],
    },
];

export const UploadPage = () => {
    const [currentFile, setCurrentFile] = useState(null);
    const [fileExtension, setFileExtension] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewDuration, setPreviewDuration] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(-1);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const { formData, isValid, setPathIsBlurred, setPathValue, getValue, getError } = useValidatableForm({
        rules,
        hideBeforeSubmit: true,
        showAfterBlur: true,
        focusToErrorAfterSubmit: true,
    });

    const handleOnDrop = (file) => {
        const reader = new FileReader();
        console.log(file);
        reader.onload = function (e) {
            const contents = e.target.result;
            setFileExtension(file[0].name.split('.').pop());
            setCurrentFile(contents);
        };
        const preview = URL.createObjectURL(file[0]);
        setPreviewFile(preview);
        getBlobDuration(preview).then((value) => {
            setPreviewDuration(new Date(1000 * value).toISOString().substr(14, 5));
        });
        reader.readAsArrayBuffer(file[0]);
    };

    const handleSendVideo = async (event) => {
        if (isValid) {
            setUploading(true);
            const id = createId();
            const fileName = formData.title + '-' + id.toString() + '.' + fileExtension;
            await uploadVideo({ video: currentFile, name: fileName }).on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(progress);
                },
                (error) => {
                    setError(error.message);
                },
                () => {
                    addVideoDatabase({
                        title: formData.title,
                        duration: previewDuration,
                        description: formData.description,
                        fileName: fileName,
                        id: id,
                    }).then(() => {
                        setUploading(false);
                    });
                }
            );
        }
        event.preventDefault();
    };

    return (
        <Container>
            <Box p={3}>
                <Grid
                    container
                    flexDirection={'column'}
                    minHeight={'90vh'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    {currentFile && previewFile && previewDuration ? (
                        <Box>
                            <VideoPlayer video={{ url: previewFile, duration: previewDuration }} />
                        </Box>
                    ) : (
                        <Dropzone
                            multiple={false}
                            sx={{ margin: 'auto', flex: '0.5' }}
                            accept={{ 'video/*': [] }}
                            onDrop={handleOnDrop}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <Box
                                            border={1}
                                            borderRadius={2}
                                            sx={{ borderStyle: 'dashed' }}
                                            borderColor={'black'}
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            p={20}
                                        >
                                            <input {...getInputProps()} />
                                            <p>Drag and drop some files here, or click to select files</p>
                                        </Box>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    )}
                    <Box width={'80%'}>
                        <form onSubmit={handleSendVideo}>
                            <Box p={1}>
                                <TextField
                                    fullWidth
                                    placeholder={'Video Title'}
                                    error={!!getError('title')}
                                    helperText={getError('title')}
                                    disabled={uploading || uploadProgress === 100}
                                    type={'text'}
                                    value={getValue('title') || ''}
                                    onChange={(e) => setPathValue('title', e)}
                                    onBlur={() => setPathIsBlurred('title')}
                                    id="title"
                                />
                            </Box>
                            <Box p={1}>
                                <TextField
                                    fullWidth
                                    placeholder={'Video Description'}
                                    error={!!getError('description')}
                                    helperText={getError('description')}
                                    type={'text'}
                                    multiline
                                    rows={5}
                                    disabled={uploading || uploadProgress === 100}
                                    value={getValue('description') || ''}
                                    onChange={(e) => setPathValue('description', e)}
                                    onBlur={() => setPathIsBlurred('description')}
                                    id="description"
                                />
                            </Box>
                            <Box p={1} alignSelf={'center'}>
                                <Button
                                    fullWidth
                                    loading={uploading}
                                    disabled={uploadProgress === 100}
                                    variant={'contained'}
                                    color={'secondary'}
                                    onClick={handleSendVideo}
                                >
                                    Submit Video
                                </Button>
                            </Box>
                        </form>
                    </Box>
                    {uploadProgress > 0 && uploadProgress < 100 ? (
                        <Grid width={'100%'}>
                            <LinearProgress variant={'determinate'} color={'secondary'} value={uploadProgress} />
                        </Grid>
                    ) : uploadProgress === 100 ? (
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            flex={1}
                            height={'100%'}
                        >
                            <Box pb={2}>
                                <SentimentSatisfied fontSize={'large'} color={'secondary'} display={'block'} />
                            </Box>
                            <Box textAlign={'center'}>
                                <Typography variant={'h6'}> Upload successful </Typography>
                                <UnStyledLink to={'/'}>
                                    <Typography color={'red'}>Back to Home</Typography>
                                </UnStyledLink>
                            </Box>
                        </Box>
                    ) : null}
                    {error ? <Typography color={'red'}>{error}</Typography> : null}
                </Grid>
            </Box>
        </Container>
    );
};
