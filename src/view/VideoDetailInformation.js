import { Avatar, Box, CardHeader, Divider, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UnStyledLink } from '../components/UnstyledLink';

export const VideoDetailInformation = (props) => {
    return (
        <Box pt={2}>
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
                    <UnStyledLink to={`/profile/${props.uploaderId}`}>
                        <Typography display={'inline'} variant={'h6'}>
                            {props.uploader}
                        </Typography>
                    </UnStyledLink>
                }
            />
            <Typography variant={'h6'}> Description </Typography>
            <Divider sx={{ width: '100%', p: 1 }} />
            <Typography textAlign={'start'} py={1}>
                {props.description}
            </Typography>
        </Box>
    );
};
