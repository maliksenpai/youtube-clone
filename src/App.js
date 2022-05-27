import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { app } from './index';
import { updateUser } from './redux/UserRedux';
import { MainAppBar } from './view/MainAppBar';
import { MainLoading } from './view/MainLoading';
import { MainPage } from './page/MainPage';
import { LoginPage } from './page/LoginPage';
import { ProfilePage } from './page/ProfilePage';
import { VideoPage } from './page/VideoPage';
import { UploadPage } from './page/UploadPage';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import { Button, Dialog } from 'comfort-react';

export const App = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userReducer = useSelector((state) => state.userReducer);
    const mode = useSelector((state) => state.settingsReducer).theme;
    const [openVerifiedDialog, setOpenVerifiedDialog] = useState(false);

    useEffect(() => {
        app.auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch(updateUser({ uid: user.uid, email: user.email, emailVerified: user.emailVerified }));
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (userReducer.emailVerified !== null) {
            if (!userReducer.emailVerified) {
                dispatch(updateUser({ uid: null, email: null, emailVerified: null }));
                app.auth().signOut();
                setOpenVerifiedDialog(true);
            }
        }
    }, [userReducer.emailVerified]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                              primary: {
                                  main: '#90caf9',
                              },
                          }
                        : {}),
                },
            }),
        [mode]
    );

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                {loading ? (
                    <MainLoading />
                ) : (
                    <>
                        <MainAppBar />
                        <Routes>
                            <Route path={'/'} element={<MainPage />} />
                            <Route path={'/login'} element={<LoginPage />} />
                            <Route path={'/profile/:id'} element={<ProfilePage />} />
                            <Route path={'/video/:id'} element={<VideoPage />} />
                            <Route path={'/upload'} element={<UploadPage />} />
                        </Routes>
                    </>
                )}
            </BrowserRouter>
            <Dialog
                open={openVerifiedDialog}
                onClose={() => setOpenVerifiedDialog(false)}
                title={<Typography color={'orangered'}> Warning </Typography>}
                hideCloseButton={true}
                actions={
                    <Button onClick={() => setOpenVerifiedDialog(false)}>
                        <Typography color={'red'}>Close Dialog</Typography>
                    </Button>
                }
            >
                You have to verified your email before you can use your account
            </Dialog>
        </ThemeProvider>
    );
};
