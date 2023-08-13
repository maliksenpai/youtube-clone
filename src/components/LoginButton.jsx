import { Person } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

export const LoginButton = () => {
    return (
        <Box border={1} borderRadius={1} borderColor={'#3ea6ff'}>
            <Grid container alignItems={'center'} justifyItems={'center'} p={0.5}>
                <Person style={{ color: '#3ea6ff' }} />
                <Typography color={'#3ea6ff'}> Login / Register </Typography>
            </Grid>
        </Box>
    );
};
