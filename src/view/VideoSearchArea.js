import { Grid, useMediaQuery } from '@mui/material';
import { Button, TextField } from 'comfort-react';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const VideoSearchArea = () => {
    const [value, setValue] = useState('');
    const navigator = useNavigate();
    const isSmall = useMediaQuery('(max-width:600px)');

    const onHandleSearch = () => {
        if (value) {
            navigator(`/?search=${value}`);
            setValue('');
        }
    };

    return (
        <Grid container justifyContent={'space-evenly'} alignItems={'center'} py={3}>
            <Grid item xs={11} sm={10}>
                <form onSubmit={onHandleSearch}>
                    <TextField fullWidth noHelperText value={value} onChange={setValue} />
                </form>
            </Grid>
            <Grid item xs={11} sm={1}>
                <Button variant={'contained'} fullWidth={isSmall} onClick={onHandleSearch}>
                    <Search />
                </Button>
            </Grid>
        </Grid>
    );
};
