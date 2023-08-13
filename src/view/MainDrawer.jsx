import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, Toolbar, useMediaQuery } from '@mui/material';
import { HistoryOutlined, OndemandVideoOutlined, SubscriptionsOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { UnStyledLink } from '../components/UnstyledLink';
import { useSelector } from 'react-redux';

export const MainDrawer = () => {
    const isSmallScreen = useMediaQuery(`(max-width:1024px)`);
    const userReducer = useSelector((state) => state.userReducer);

    return (
        <Drawer
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isSmallScreen ? '50px' : '240px',
                },
                zIndex: 0,
            }}
            variant={'permanent'}
            anchor={'left'}
        >
            <Toolbar />
            <List sx={{ height: '100vh', width: '100%', overflow: 'auto' }}>
                <UnStyledLink to={userReducer.uid ? '/subscriptions' : '/login/subscriptions'}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SubscriptionsOutlined />
                            </ListItemIcon>
                            Subscriptions
                        </ListItemButton>
                    </ListItem>
                </UnStyledLink>
                <Divider sx={{ py: 0.5 }} />
                <UnStyledLink to={userReducer.uid ? '/history' : '/login/history'}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <HistoryOutlined />
                            </ListItemIcon>
                            History
                        </ListItemButton>
                    </ListItem>
                </UnStyledLink>
                <Divider sx={{ py: 0.5 }} />
                <UnStyledLink to={userReducer.uid ? `/profile/${userReducer.uid}` : `/login/profile/`}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <OndemandVideoOutlined />
                            </ListItemIcon>
                            Your Videos
                        </ListItemButton>
                    </ListItem>
                </UnStyledLink>
                <Divider sx={{ py: 0.5 }} />
                <UnStyledLink to={userReducer.uid ? '/liked-videos' : '/login/liked-videos'}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <ThumbUpOutlined />
                            </ListItemIcon>
                            Liked Videos
                        </ListItemButton>
                    </ListItem>
                </UnStyledLink>
            </List>
        </Drawer>
    );
};
