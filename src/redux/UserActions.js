import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserFirebase } from '../data/FirebaseUser';

export const loginUser = createAsyncThunk('loginUser', async ({ email, password }) => {
    const response = await loginUserFirebase({ email: email, password: password });
    return {
        user: {
            email: response.user.email,
            emailVerified: response.user.emailVerified,
            uid: response.user.uid,
        },
    };
});
