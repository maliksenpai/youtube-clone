import { AppBar, Avatar, Box, MenuItem, Toolbar, Typography } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { UnStyledLink } from '../components/UnstyledLink';
import { LoginButton } from '../components/LoginButton';
import { MenuButton } from 'comfort-react';
import { logoutUser } from '../data/FirebaseUser';
import { updateUser } from '../redux/UserRedux';

export const MainAppBar = () => {
    const userReducer = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleClickMenuItem = (index) => {
        if (index === 2) {
            logoutUser().then(() => dispatch(updateUser({ uid: null, email: null, emailVerified: null })));
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
            <AppBar position={'static'} style={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <Typography color={'red'} sx={{ flexGrow: 1 }}>
                        <UnStyledLink to={'/'}>Youtube Clone</UnStyledLink>
                    </Typography>
                    {userReducer.uid ? (
                        <Box>
                            <MenuButton isIconButton={true} menuChildren={menuItemsJsx}>
                                <Avatar>
                                    <Person />
                                </Avatar>
                            </MenuButton>
                        </Box>
                    ) : (
                        <Box>
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
