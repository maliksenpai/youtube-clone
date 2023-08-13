import { HashRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { firebaseApp } from './Main.jsx';
import { clearUser, updateUser } from './redux/UserRedux';
import { MainAppBar } from './view/MainAppBar';
import { MainLoading } from './view/MainLoading';
import { MainPage } from './page/MainPage';
import { LoginPage } from './page/LoginPage';
import { ProfilePage } from './page/ProfilePage';
import { VideoPage } from './page/VideoPage';
import { UploadPage } from './page/UploadPage';
import { createTheme, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { Button, Dialog } from 'comfort-react';
import { getDataForUser } from './redux/UserActions';
import { HistoryVideosPage } from './page/HistoryVideosPage';
import { LikedVideosPage } from './page/LikedVideosPage';
import { SubscriptionsPage } from './page/SubscriptionsPage';

export const App = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const userReducer = useSelector((state) => state.userReducer);
    const mode = useSelector((state) => state.settingsReducer).theme;
    const [openVerifiedDialog, setOpenVerifiedDialog] = useState(false);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch(updateUser({ uid: user.uid, email: user.email, emailVerified: user.emailVerified }));
                dispatch(getDataForUser({ id: user.uid }));
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (userReducer.emailVerified !== null) {
            if (!userReducer.emailVerified) {
                dispatch(clearUser());
                firebaseApp.auth().signOut();
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
            <HashRouter>
                {loading ? (
                    <MainLoading />
                ) : (
                    <>
                        <MainAppBar />
                        <Toolbar />
                        <Routes>
                            <Route path={'/'} element={<MainPage />} />
                            <Route path={'/login'} element={<LoginPage />} />
                            <Route path={'/login/:redirect'} element={<LoginPage />} />
                            <Route path={'/profile/:id'} element={<ProfilePage />} />
                            <Route path={'/video/:id'} element={<VideoPage />} />
                            <Route exact path={'/upload'} element={<UploadPage />} />
                            <Route exact path={'/history'} element={<HistoryVideosPage />} />
                            <Route exact path={'/liked-videos'} element={<LikedVideosPage />} />
                            <Route exact path={'/subscriptions'} element={<SubscriptionsPage />} />
                        </Routes>
                    </>
                )}
            </HashRouter>
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
