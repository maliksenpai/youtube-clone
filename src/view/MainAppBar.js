import { AppBar, Avatar, Box, MenuItem, Toolbar, Typography } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { UnStyledLink } from '../components/UnstyledLink';
import { LoginButton } from '../components/LoginButton';
import { Button, MenuButton } from 'comfort-react';
import { logoutUser } from '../data/FirebaseUser';
import { clearUser } from '../redux/UserRedux';

export const MainAppBar = () => {
    const userReducer = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleClickMenuItem = (index) => {
        if (index === 2) {
            logoutUser().then(() => dispatch(clearUser()));
        }
    };

    const menuItems = [
        {
            icon: <Person />,
            title: 'Profile',
            link: `/profile/${userReducer.uid}`,
        },
        {
            icon: <Settings />,
            title: 'Settings',
            link: '',
        },
        {
            icon: <Logout />,
            title: 'Logout',
            link: '',
        },
    ];

    const menuItemsJsx = menuItems.map((element, index) => {
        return (
            <MenuItem key={element.title} onClick={() => handleClickMenuItem(index)}>
                {element.link ? (
                    <UnStyledLink to={element.link}>
                        <Box p={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            {element.icon}
                            {element.title}
                        </Box>
                    </UnStyledLink>
                ) : (
                    <Box p={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        {element.icon}
                        {element.title}
                    </Box>
                )}
            </MenuItem>
        );
    });
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar style={{ backgroundColor: 'white' }}>
                <Toolbar sx={{ zIndex: 1000 }}>
                    <Typography color={'red'} sx={{ flexGrow: 1 }}>
                        <UnStyledLink to={'/'}>Youtube Clone</UnStyledLink>
                    </Typography>
                    {userReducer.uid ? (
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <UnStyledLink to={'/upload'}>
                                <Button variant={'outlined'} color={'primary'}>
                                    Upload Video
                                </Button>
                            </UnStyledLink>
                            <MenuButton isIconButton={true} menuChildren={menuItemsJsx}>
                                <Avatar>
                                    <Person />
                                </Avatar>
                            </MenuButton>
                        </Box>
                    ) : (
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                            <Box pr={1}>
                                <UnStyledLink to={'/login'}>
                                    <Button variant={'outlined'} color={'primary'}>
                                        Upload Video
                                    </Button>
                                </UnStyledLink>
                            </Box>
                            <UnStyledLink to={'/login'}>
                                <LoginButton />
                            </UnStyledLink>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};
