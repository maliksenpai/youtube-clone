import { Person } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

export const LoginButton = () => {
    return (
        <Box border={1} borderRadius={1} borderColor={'#3ea6ff'}>
            <Grid container alignItems={'center'} justifyItems={'center'} p={1}>
                <Person style={{ color: '#3ea6ff' }} />
                <Typography color={'#3ea6ff'}> Login </Typography>
            </Grid>
        </Box>
    );
};
