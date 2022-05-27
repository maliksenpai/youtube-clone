import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, IconButton, useValidatableForm, TextField } from 'comfort-react';
import { Box, CircularProgress, Container, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../redux/UserActions';

const rules = [
    {
        path: 'email',
        ruleSet: [{ rule: 'required' }, { rule: 'email' }],
        dependantPaths: ['comparisonValue'],
    },
    {
        path: 'password',
        ruleSet: [
            { rule: 'required' },
            {
                rule: 'length',
                greaterThan: 8,
            },
        ],
        dependantPaths: ['comparisonValue'],
    },
];

export const LoginPage = () => {
    const navigator = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const userReducer = useSelector((state) => state.userReducer);
    const { formData, isValid, setPathIsBlurred, setPathValue, getValue, getError } = useValidatableForm({
        rules,
        hideBeforeSubmit: true,
        showAfterBlur: true,
        focusToErrorAfterSubmit: true,
    });

    useEffect(() => {
        if (userReducer.uid) {
            navigator('/');
        }
    }, [userReducer]);

    const handleSubmit = (event) => {
        if (isValid) {
            const email = formData.email;
            const password = formData.password;
            dispatch(loginUser({ email: email, password: password }));
        }
        event.preventDefault();
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    textAlign={'center'}
                    height={'90vh'}
                >
                    <Box width={'40vw'} p={1}>
                        If you do not have an account, you will be automatically redirected to the registration screen.
                    </Box>
                    <Box width={'40vw'} p={1}>
                        <TextField
                            fullWidth
                            placeholder={'Email'}
                            error={!!getError('email')}
                            helperText={getError('email')}
                            type={'text'}
                            value={getValue('email') || ''}
                            onChange={(e) => setPathValue('email', e)}
                            onBlur={() => setPathIsBlurred('email')}
                            id="email"
                        />
                    </Box>
                    <Box width={'40vw'} p={1}>
                        <TextField
                            fullWidth
                            placeholder={'Password'}
                            error={!!getError('password')}
                            type={showPassword ? 'text' : 'password'}
                            helperText={getError('password')}
                            value={getValue('password') || ''}
                            onChange={(e) => setPathValue('password', e)}
                            onBlur={() => setPathIsBlurred('password')}
                            id="password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position={'end'}>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box width={'40vw'} p={1}>
                        <Button type={'submit'} onSubmit={handleSubmit} variant={'contained'} color={'error'} fullWidth>
                            Login
                        </Button>
                    </Box>
                    {userReducer.loading ? <CircularProgress color={'warning'} /> : null}
                </Box>
            </form>
        </Container>
    );
};
